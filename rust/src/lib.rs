#![deny(clippy::all)]

use napi::{Env, JsBuffer, JsUndefined};
use rgba_to_yuva422::{rgb_to_yuv422, YuvConstants};

mod rgba_to_yuva422;

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
  if width % 2 != 0 {
    env.throw_error("Width must be a multiple of 2", None)?;
  }
  let byte_count = pixel_count * 4;
  if input_vec.len() != byte_count {
    env.throw_error("Input buffer has incorrect length", None)?;
  }
  if output_vec.len() != byte_count {
    env.throw_error("Output buffer has incorrect length", None)?;
  }

  let [kr, kb] = if height >= 720 {
    [0.2126, 0.0722] // BT.709
  } else {
    [0.299, 0.114] // BT.601
  };

  let constants = YuvConstants::create(kr, kb);

  let sample_count = pixel_count / 2;
  for i in 0..sample_count {
    let offset = i * 8;

    let offset4 = offset + 4;
    let offset8 = offset + 8;
    rgb_to_yuv422(
      &constants,
      &input_vec[offset..offset4], // HACK remove this mess!
      &input_vec[offset4..offset8],
      &mut output_vec[offset..offset8],
    );
  }

  env.get_undefined()
}
