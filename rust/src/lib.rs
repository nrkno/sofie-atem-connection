#![deny(clippy::all)]

use napi::{Env, JsBuffer, JsUndefined};

#[macro_use]
extern crate napi_derive;

/// Convert a RGBA buffer to ATEM YUV422 packing in the correct colorspace
///
/// This is performed synchronously
///
/// @param width - The width of the image
/// @param height - The height of the image
/// @param data - The input pixel data
#[napi]
pub fn convert_rgba_to_yuv_422(
  env: Env,
  width: u32,
  height: u32,
  input: JsBuffer,
  output: JsBuffer,
) -> napi::Result<JsUndefined> {
  // @todo: BALTE - 2018-5-24:
  // Create util functions that handle proper colour spaces in UHD.

  let input_vec = input.into_value()?;
  let mut output_vec = output.into_value()?;

  let pixel_count = (width * height) as usize;
  let byte_count = pixel_count * 4;
  if input_vec.len() != byte_count {
    env.throw_error("Input buffer has incorrect length", None)?;
  }
  if output_vec.len() != byte_count {
    env.throw_error("Output buffer has incorrect length", None)?;
  }

  // BT.709 or BT.601
  let [KR, KB] = if height >= 720 {
    [0.2126, 0.0722]
  } else {
    [0.299, 0.114]
  };
  let KG: f32 = 1.0 - KR - KB;

  let KRi: f32 = 1.0 - KR;
  let KBi: f32 = 1.0 - KB;

  let YRange: f32 = 219.0;
  let CbCrRange: f32 = 224.0;
  let HalfCbCrRange: f32 = CbCrRange / 2.0;

  let YOffset: f32 = (16 << 8) as f32;
  let CbCrOffset: f32 = (128 << 8) as f32;

  let KRoKBi: f32 = (KR / KBi) * HalfCbCrRange;
  let KGoKBi: f32 = (KG / KBi) * HalfCbCrRange;
  let KBoKRi: f32 = (KB / KRi) * HalfCbCrRange;
  let KGoKRi: f32 = (KG / KRi) * HalfCbCrRange;

  for i in 0..pixel_count {
    let offset = i * 8;

    let r1 = input_vec[offset + 0] as f32;
    let g1 = input_vec[offset + 1] as f32;
    let b1 = input_vec[offset + 2] as f32;

    let r2 = input_vec[offset + 4] as f32;
    let g2 = input_vec[offset + 5] as f32;
    let b2 = input_vec[offset + 6] as f32;

    let a1 = input_vec[offset + 3];
    let a2 = input_vec[offset + 7];

    let y16a = YOffset + KR * YRange * r1 + KG * YRange * g1 + KB * YRange * b1;
    let cb16 = CbCrOffset + (-KRoKBi * r1 - KGoKBi * g1 + HalfCbCrRange * b1);
    let y16b = YOffset + KR * YRange * r2 + KG * YRange * g2 + KB * YRange * b2;
    let cr16 = CbCrOffset + (HalfCbCrRange * r1 - KGoKRi * g1 - KBoKRi * b1);

    let block1 = gen_color(a1.into(), cb16, y16a).to_be_bytes();
    let block2 = gen_color(a2.into(), cr16, y16b).to_be_bytes();

    // TODO - is this 'cleverness' more or less efficient
    let offset4 = offset + 4;
    let offset8 = offset + 8;
    output_vec[offset..offset4].copy_from_slice(&block1);
    output_vec[offset4..offset8].copy_from_slice(&block2);
  }

  env.get_undefined()
}

fn gen_color(raw_a: u32, uv16: f32, y16: f32) -> u32 {
  let a = ((raw_a << 2) * 219) / 255 + (16 << 2);
  let y = (y16.round() as u32) >> 6;
  let uv = (uv16.round() as u32) >> 6;

  (a << 20) + (uv << 10) + y
}
