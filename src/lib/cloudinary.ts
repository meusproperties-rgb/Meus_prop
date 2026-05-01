import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function assertCloudinaryConfig() {
  const missing = [
    ['CLOUDINARY_CLOUD_NAME', process.env.CLOUDINARY_CLOUD_NAME],
    ['CLOUDINARY_API_KEY', process.env.CLOUDINARY_API_KEY],
    ['CLOUDINARY_API_SECRET', process.env.CLOUDINARY_API_SECRET],
  ]
    .filter(([, value]) => !value || String(value).startsWith('your-'))
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Cloudinary is not configured. Update ${missing.join(', ')} in .env.local.`);
  }
}

export async function uploadImage(
  base64Image: string,
  folder = 'meus-realestate/properties'
): Promise<{ url: string; publicId: string }> {
  assertCloudinaryConfig();

  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    transformation: [
      { width: 1920, height: 1080, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function uploadMultipleImages(
  base64Images: string[],
  folder = 'meus-realestate/properties'
): Promise<Array<{ url: string; publicId: string }>> {
  const uploads = await Promise.all(
    base64Images.map((img) => uploadImage(img, folder))
  );
  return uploads;
}

export default cloudinary;
