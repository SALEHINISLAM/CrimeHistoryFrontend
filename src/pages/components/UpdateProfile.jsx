import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEditProfileMutation } from "../../redux/features/users/user.api";
import { toast } from "sonner";
import { uploadToCloudinary } from "../../utilis/cloudinaryUploads";

const ProfileUpdate = ({ userData }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedImage, setUploadedImage] = useState("");
    const [updateProfile] = useEditProfileMutation();

    // Pre-fill form with user data
    useEffect(() => {
        if (userData) {
            reset({
                email: userData.email,
                name: userData.name,
                bio: userData.bio,
                profilePic: userData.profile_pic,
            });
            setUploadedImage(userData.profile_pic);
        }
    }, [userData, reset]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles([file]);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFiles([]);
        setUploadedImage("");
    };

    const handleUploadImage = async () => {
        if (selectedFiles.length === 0) return null;
        const uploaded = await uploadToCloudinary(selectedFiles[0]);
        setSelectedFiles([]);
        return uploaded;
    };

    const onSubmit = async (data) => {
        try {
            const image_url = await handleUploadImage();
            const updatedData = {
                ...data,
                profilePic: image_url || uploadedImage, // Use new image or existing one
            };

            const response = await updateProfile(updatedData).unwrap();
            console.log(response)
            if (response.success) {
                toast.success("Profile updated successfully", { duration: 3000 });
                reset();
                setUploadedImage(image_url || uploadedImage);
            } else {
                toast.error("Failed to update profile", { duration: 3000 });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Something went wrong", { duration: 3000 });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`input input-bordered ${errors.email ? "input-error" : ""
                                    }`}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                            />
                            {errors.email && (
                                <span className="text-error text-sm mt-1">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        {/* Name Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className={`input input-bordered ${errors.name ? "input-error" : ""
                                    }`}
                                {...register("name", {
                                    required: "Name is required",
                                })}
                            />
                            {errors.name && (
                                <span className="text-error text-sm mt-1">
                                    {errors.name.message}
                                </span>
                            )}
                        </div>

                        {/* Bio Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Bio</span>
                            </label>
                            <textarea
                                placeholder="Enter your bio"
                                className={`textarea textarea-bordered ${errors.bio ? "textarea-error" : ""
                                    }`}
                                {...register("bio")}
                            />
                        </div>

                        {/* Profile Picture Upload */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Picture</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="file-input file-input-bordered w-full"
                                onChange={handleFileSelect}
                            />
                        </div>

                        {/* Display Selected or Uploaded Image */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(selectedFiles.length > 0 || uploadedImage) && (
                                <div className="relative">
                                    <img
                                        src={
                                            selectedFiles.length > 0
                                                ? URL.createObjectURL(selectedFiles[0])
                                                : uploadedImage
                                        }
                                        alt="Profile"
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
                                        onClick={handleRemoveImage}
                                    >
                                        X
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdate;