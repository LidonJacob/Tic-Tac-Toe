import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET = "tictactoe_avatars";

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadAvatar = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await axios.post(UPLOAD_URL, formData);
  return response.data.secure_url;
};
