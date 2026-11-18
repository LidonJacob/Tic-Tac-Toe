const compressImage = async (imageFile) => {
  const bitmap = await createImageBitmap(imageFile);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxDimension = 1200;

  const scale = Math.min(
    maxDimension / bitmap.width,
    maxDimension / bitmap.height,
    1,
  );

  const newWidth = Math.round(bitmap.width * scale);
  const newHeight = Math.round(bitmap.height * scale);

  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);

  const compressedBlob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.8);
  });

  if (!compressedBlob) {
    throw new Error("Failed to compress image");
  }

  return compressedBlob;
};

export default compressImage;
