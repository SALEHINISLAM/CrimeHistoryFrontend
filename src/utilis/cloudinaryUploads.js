export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Set your Cloudinary Upload Preset

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log(data)
        return data.secure_url; 
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return null;
    }
};
