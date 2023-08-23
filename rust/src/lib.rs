#![deny(clippy::all)]

use napi::{
  bindgen_prelude::{AsyncTask, FromNapiValue, ToNapiValue, Uint8Array},
  Env, Error, JsBuffer, JsObject, JsString, Status, Task,
};

#[macro_use]
extern crate napi_derive;

// #[napi]
// #[derive(PartialEq)]
// pub enum PixelFormat {
//   Rgba,
//   Rgb,
//   // Argb,
// }

// #[napi]
// #[derive(PartialEq)]
// pub enum ResizeMode {
//   Exact,
//   Fill,
//   Fit,
// }

// #[napi(object)]
// pub struct ImageInfo {
//   pub format: PixelFormat,
//   pub width: u32,
//   pub height: u32,
// }

// #[napi]
// #[derive(PartialEq)]
// pub enum RotationMode {
//   CW90,
//   CW180,
//   CW270,
// }

// #[napi(object)]
// pub struct TransformOptions {
//   pub scale_mode: Option<ResizeMode>,
//   pub flip_h: Option<bool>,
//   pub flip_v: Option<bool>,
//   pub rotation: Option<RotationMode>,
// }

// fn load_image(
//   source_buffer: &Uint8Array,
//   width: u32,
//   height: u32,
//   format: PixelFormat,
// ) -> Option<DynamicImage> {
//   match format {
//     PixelFormat::Rgba => RgbaImage::from_raw(width, height, source_buffer.to_vec())
//       .and_then(|img| Some(DynamicImage::from(img))),
//     // PixelFormat::Argb => todo!(),
//     PixelFormat::Rgb => RgbImage::from_raw(width, height, source_buffer.to_vec())
//       .and_then(|img| Some(DynamicImage::from(img))),
//   }
// }

// fn resize_image(img: &DynamicImage, width: u32, height: u32, mode: &ResizeMode) -> DynamicImage {
//   match mode {
//     ResizeMode::Exact => img.resize_exact(width, height, image::imageops::FilterType::Lanczos3),
//     ResizeMode::Fill => img.resize_to_fill(width, height, image::imageops::FilterType::Lanczos3),
//     ResizeMode::Fit => img.resize(width, height, image::imageops::FilterType::Lanczos3),
//   }
// }

// fn encode_image(img: DynamicImage, format: &PixelFormat) -> Vec<u8> {
//   match format {
//     PixelFormat::Rgba => img.into_rgba8().into_vec(),
//     PixelFormat::Rgb => img.into_rgb8().into_vec(),
//   }
// }

// fn is_electron(env: napi::Env) -> napi::Result<bool> {
//   let version = env
//     .get_global()?
//     .get_named_property::<JsObject>("process")?
//     .get_named_property::<JsObject>("versions")?
//     .get_named_property::<JsString>("electron")?
//     .into_utf8();

//   match version {
//     Err(_) => Ok(false),
//     Ok(_) => Ok(true),
//   }
// }

// fn should_return_self(
//   source_info: &ImageInfo,
//   target_info: &ImageInfo,
//   options: &TransformOptions,
// ) -> bool {
//   if source_info.width != target_info.width
//     || source_info.height != target_info.height
//     || source_info.format != target_info.format
//   {
//     // Image is different size
//     false
//   } else if options.flip_v.unwrap_or(false) || options.flip_h.unwrap_or(false) {
//     false
//   } else {
//     true
//   }
// }

// pub struct AsyncTransform {
//   spec: TransformSpec,
//   target_format: PixelFormat,
//   copy_buffer: bool,
// }

// impl napi::Task for AsyncTransform {
//   type Output = Vec<u8>;
//   type JsValue = JsBuffer;

//   fn compute(&mut self) -> napi::Result<Self::Output> {
//     let mut img = load_image(
//       &self.spec.buffer,
//       self.spec.width,
//       self.spec.height,
//       self.spec.format,
//     )
//     .ok_or_else(|| Error::new(Status::GenericFailure, "Invalid pixel buffer"))?;

//     for op in self.spec.ops.iter() {
//       img = match op {
//         TransformOps::Scale(op) => resize_image(&img, op.width, op.height, &op.mode),
//         TransformOps::FlipV => img.flipv(),
//         TransformOps::FlipH => img.fliph(),
//         TransformOps::Rotate(mode) => match mode {
//           RotationMode::CW90 => img.rotate90(),
//           RotationMode::CW180 => img.rotate180(),
//           RotationMode::CW270 => img.rotate270(),
//         },
//       };
//     }

//     let encoded = encode_image(img, &self.target_format);

//     Ok(encoded)
//   }

//   fn resolve(&mut self, env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
//     if self.copy_buffer {
//       env.create_buffer_copy(output).map(|o| o.into_raw())
//     } else {
//       env.create_buffer_with_data(output).map(|o| o.into_raw())
//     }
//   }
// }

// #[derive(Clone)]
// pub struct ScaleOp {
//   width: u32,
//   height: u32,
//   mode: ResizeMode,
// }

// #[derive(Clone)]
// pub enum TransformOps {
//   Scale(ScaleOp),
//   FlipV,
//   FlipH,
//   Rotate(RotationMode),
// }

// #[derive(Clone)]
// pub struct TransformSpec {
//   buffer: Uint8Array, // TODO - is this safe to Clone?
//   width: u32,
//   height: u32,
//   format: PixelFormat,

//   ops: Vec<TransformOps>,
// }

#[napi]
pub struct ImageTransformer {
  // transformer: TransformSpec,
}
// #[napi]
// impl ImageTransformer {
//   /// Create an `ImageTransformer` from a `Buffer` or `Uint8Array`
//   ///
//   /// @param buffer - The image to transform
//   /// @param width - Width of the image
//   /// @param height - Height of the image
//   /// @param format - Pixel format of the buffer
//   #[napi(factory)]
//   pub fn from_buffer(buffer: Uint8Array, width: u32, height: u32, format: PixelFormat) -> Self {
//     ImageTransformer {
//       transformer: TransformSpec {
//         buffer,
//         width,
//         height,
//         format,
//         ops: Vec::new(),
//       },
//     }
//   }

//   /// Add a scale step to the transform sequence
//   ///
//   /// @param width - Target width for the image
//   /// @param height - Target height for the image
//   /// @param mode - Method to use when source and target aspect ratios do not match
//   #[napi]
//   pub fn scale(
//     &mut self,
//     width: u32,
//     height: u32,
//     mode: Option<ResizeMode>,
//   ) -> napi::Result<&Self> {
//     if width == 0 || height == 0 {
//       Err(Error::new(Status::GenericFailure, "Invalid dimensions"))
//     } else {
//       self.transformer.ops.push(TransformOps::Scale(ScaleOp {
//         width,
//         height,
//         mode: mode.unwrap_or(ResizeMode::Exact),
//       }));

//       Ok(self)
//     }
//   }

//   /// Add a vertical flip step to the transform sequence
//   #[napi]
//   pub fn flip_vertical(&mut self) -> &Self {
//     self.transformer.ops.push(TransformOps::FlipV);

//     self
//   }

//   /// Add a horizontal flip step to the transform sequence
//   #[napi]
//   pub fn flip_horizontal(&mut self) -> &Self {
//     self.transformer.ops.push(TransformOps::FlipH);

//     self
//   }

//   /// Add a rotation step to the transform sequence
//   ///
//   /// @param rotation - The amount to rotate by
//   #[napi]
//   pub fn rotate(&mut self, rotation: RotationMode) -> &Self {
//     self.transformer.ops.push(TransformOps::Rotate(rotation));

//     self
//   }

//   /// Convert the transformed image to a Buffer
//   ///
//   /// Danger: This is performed synchronously on the main thread, which can become a performance bottleneck. It is advised to use `toBuffer` whenever possible
//   ///
//   /// @param format - The pixel format to pack into the buffer
//   #[napi]
//   pub fn to_buffer_sync(&self, env: Env, format: PixelFormat) -> napi::Result<JsBuffer> {
//     let copy_buffer = is_electron(env)?;

//     println!("debug copy: {}", copy_buffer);

//     let mut task = AsyncTransform {
//       spec: self.transformer.clone(),
//       target_format: format,
//       copy_buffer,
//     };

//     let output = task.compute()?;

//     task.resolve(env, output)
//   }

//   /// Asynchronously convert the transformed image to a Buffer
//   ///
//   /// @param format - The pixel format to pack into the buffer
//   #[napi(ts_return_type = "Promise<Buffer>")]
//   pub fn to_buffer(
//     &self,
//     env: Env,
//     format: PixelFormat,
//   ) -> napi::Result<AsyncTask<AsyncTransform>> {
//     let copy_buffer = is_electron(env)?;

//     let task = AsyncTransform {
//       spec: self.transformer.clone(),
//       target_format: format,
//       copy_buffer,
//     };

//     Ok(AsyncTask::new(task))
//   }
// }
