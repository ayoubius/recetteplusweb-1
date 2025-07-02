
import { Cloudinary } from 'cloudinary-core';

const cloudinary = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djhr1eae6',
  secure: true
});

export const uploadVideoToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'RecettePlus_Preset');
  formData.append('resource_type', 'video');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/djhr1eae6/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de la vidéo');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    throw error;
  }
};

export const getVideoThumbnail = (publicId: string): string => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [
      { width: 400, height: 300, crop: 'fill' },
      { quality: 'auto' }
    ]
  });
};

export const getVideoUrl = (publicId: string): string => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'mp4',
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  });
};

export { cloudinary };
