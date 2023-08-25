#![deny(clippy::all)]

const CB_CR_OFFSET: f32 = 512.0;
const CB_CR_SCALE: f32 = 224.0 / 64.0;
const HALF_CB_CR_SCALE: f32 = CB_CR_SCALE / 2.0;

const ALPHA_SCALE: f32 = 219.0 / 255.0 * 4.0;
const LUMA_SCALE: f32 = 219.0 / 64.0;
const ALPHA_OFFSET: u32 = 64;
const LUMA_OFFSET: u32 = 64;

#[inline(always)]
pub fn rgb_to_yuv422(constants: &YuvConstants, rgba1: &[u8], rgba2: &[u8], target: &mut [u8]) {
  let y16a = calc_y(constants, rgba1);
  let cb16 = calc_cb(constants, rgba1);
  let y16b = calc_y(constants, rgba2);
  let cr16 = calc_cr(constants, rgba1);

  let a1 = alpha_8_to_10bit(rgba1[3]);
  let a2 = alpha_8_to_10bit(rgba2[3]);

  let block1 = combine_components(a1, cb16, y16a).to_be_bytes();
  let block2 = combine_components(a2, cr16, y16b).to_be_bytes();

  // TODO - is this 'cleverness' more or less efficient than writing bytes individually?
  target[0..4].copy_from_slice(&block1);
  target[4..8].copy_from_slice(&block2);
}

#[inline(always)]
fn calc_y(constants: &YuvConstants, rgba: &[u8]) -> u32 {
  let luma = constants.kr * (rgba[0] as f32)
    + constants.kg * (rgba[1] as f32)
    + constants.kb * (rgba[2] as f32);

  // TODO - round instead of floor
  LUMA_OFFSET + ((LUMA_SCALE * luma).floor() as u32)
}

#[inline(always)]
fn calc_cb(constants: &YuvConstants, rgba: &[u8]) -> u32 {
  let val = -constants.kr_o_kb_i * (rgba[0] as f32) - constants.kg_o_kb_i * (rgba[1] as f32)
    + (rgba[2] as f32);

  // TODO - round instead of floor
  (CB_CR_OFFSET + (HALF_CB_CR_SCALE * val).floor()) as u32
}

#[inline(always)]
fn calc_cr(constants: &YuvConstants, rgba: &[u8]) -> u32 {
  let val = (rgba[0] as f32)
    - constants.kg_o_kr_i * (rgba[1] as f32)
    - constants.kb_o_kr_i * (rgba[2] as f32);

  // TODO - round instead of floor
  (CB_CR_OFFSET + (HALF_CB_CR_SCALE * val).floor()) as u32
}

#[inline(always)]
fn alpha_8_to_10bit(val: u8) -> u32 {
  // TODO - do round instead of floor
  ALPHA_OFFSET + (val as f32 * ALPHA_SCALE).floor() as u32
}

pub struct YuvConstants {
  pub kr: f32,
  pub kb: f32,
  pub kg: f32,

  // pub kr_i: f32,
  // pub kb_i: f32,
  pub kr_o_kb_i: f32,
  pub kg_o_kb_i: f32,
  pub kb_o_kr_i: f32,
  pub kg_o_kr_i: f32,
}
impl YuvConstants {
  pub fn create(kr: f32, kb: f32) -> YuvConstants {
    let kg = 1.0 - kr - kb;
    let kr_i = 1.0 - kr;
    let kb_i = 1.0 - kb;

    YuvConstants {
      kr,
      kb,
      kg,

      // kr_i,
      // kb_i,
      kr_o_kb_i: kr / kb_i,
      kg_o_kb_i: kg / kb_i,
      kb_o_kr_i: kb / kr_i,
      kg_o_kr_i: kg / kr_i,
    }
  }
}

#[inline(always)]
fn combine_components(a: u32, uv: u32, y: u32) -> u32 {
  (a << 20) + (uv << 10) + y
}

#[cfg(test)]
mod tests {
  // Note this useful idiom: importing names from outer (for mod tests) scope.
  use super::*;

  fn rgb_to_yuv422_single(input: &[u8; 8]) -> [u8; 8] {
    let bt601_constants = YuvConstants::create(0.299, 0.114);
    let mut target = [0; 8];

    rgb_to_yuv422(&bt601_constants, &input[0..4], &input[4..8], &mut target);

    target
  }

  #[test]
  fn test_black() {
    let input = [0, 0, 0, 0, 0, 0, 0, 0];
    let output = [4, 8, 0, 64, 4, 8, 0, 64];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }

  #[test]
  fn test_one() {
    let input = [28, 69, 148, 247, 117, 221, 18, 95];
    let output = [57, 10, 137, 32, 24, 102, 134, 122];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }

  #[test]
  fn test_two() {
    let input = [161, 62, 67, 203, 195, 251, 198, 239];
    let output = [47, 151, 57, 123, 55, 90, 175, 76];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }

  #[test]
  fn test_three() {
    let input = [189, 218, 98, 133, 76, 128, 210, 222];
    let output = [32, 132, 254, 221, 51, 167, 189, 224];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }

  #[test]
  fn test_four() {
    let input = [105, 85, 41, 102, 106, 19, 8, 133];
    let output = [25, 230, 157, 102, 32, 136, 188, 213];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }

  #[test]
  fn test_five() {
    let input = [96, 119, 88, 3, 90, 181, 110, 189];
    let output = [4, 167, 93, 179, 44, 151, 130, 50];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }

  #[test]
  fn test_six() {
    let input = [74, 254, 208, 22, 141, 123, 40, 132];
    let output = [8, 184, 102, 219, 32, 83, 73, 214];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }

  #[test]
  fn test_seven() {
    let input = [73, 49, 151, 173, 119, 123, 207, 152];
    let output = [41, 42, 145, 40, 36, 168, 50, 1];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }
  #[test]
  fn test_eight() {
    let input = [171, 98, 86, 67, 159, 235, 17, 105];
    let output = [18, 102, 253, 213, 26, 138, 14, 193];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }
  #[test]
  fn test_nine() {
    let input = [130, 226, 137, 84, 215, 97, 152, 118];
    let output = [22, 6, 114, 192, 29, 85, 198, 26];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }
  #[test]
  fn test_ten() {
    let input = [245, 20, 254, 158, 241, 114, 121, 152];
    let output = [37, 236, 81, 197, 36, 173, 30, 74];
    assert_eq!(rgb_to_yuv422_single(&input), output);
  }
}
