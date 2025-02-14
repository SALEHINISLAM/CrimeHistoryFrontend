import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadToCloudinary } from "../../utilis/cloudinaryUploads";
import { useAddCrimeReportMutation } from "../../redux/features/crimes/crimes.api";
import { useAppDispatch } from "../../redux/hooks";
import { optimisticCreateCrimePost, rollbackCreateCrimePost } from "../../redux/features/crimes/crimeSlice";
import { toast } from "sonner";

export default function CreateCrimePost() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [createPost] = useAddCrimeReportMutation();
    const dispatch=useAppDispatch()

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleRemoveImage = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUploadImages = async () => {
        if (selectedFiles.length === 0) return [];
        const uploaded = await Promise.all(
            selectedFiles.map(async (file) => await uploadToCloudinary(file))
        );
        setSelectedFiles([]);
        return uploaded;
    };

    const onSubmit = async (data) => {
        const toastId=toast.loading("Posting...");
        const image_urls = await handleUploadImages();

        const postData = {
            ...data,
            crime_time: new Date(data.crimeTime).getTime(),
            image_urls,
            is_anonymous: isAnonymous,
        };
        const tempCrimePost = {
            ...data,
            report_id: crypto.randomUUID(),
            crime_time: Date.parse(data.crimeTime),
            image_urls,
            is_anonymous: isAnonymous,
            createdAt: new Date().toISOString(),
        };
        dispatch(optimisticCreateCrimePost(tempCrimePost));
        try {
            await createPost(postData).unwrap();
            console.log("Post created successfully");
            reset();
            setIsAnonymous(false);
            toast.success("Crime post created successfully", { id:toastId,duration: 3000 });
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Error creating post", {id:toastId, duration: 3000 });
            dispatch(rollbackCreateCrimePost({ report_id: tempCrimePost.report_id }));
        }
    };

    return (
        <div className="w-full mx-auto p-4 bg-white rounded-md">
            <h2 className="text-xl font-semibold mb-4">Create Crime Post</h2>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control">
                            <label className="label">Title</label>
                            <input type="text" placeholder="Title" className="input input-bordered"
                                {...register("title", { required: "Title is required" })} />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div className="form-control">
                            <label className="label">Description</label>
                            <textarea placeholder="Description" className="textarea textarea-bordered"
                                {...register("description", { required: "Description is required" })}></textarea>
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        <div className="form-control">
                            <label className="label">Division</label>
                            <input type="text" placeholder="Division" className="input input-bordered"
                                {...register("division", { required: "Division is required" })} />
                            {errors.division && <p className="text-red-500 text-sm">{errors.division.message}</p>}
                        </div>

                        <div className="form-control">
                            <label className="label">District</label>
                            <input type="text" placeholder="District" className="input input-bordered"
                                {...register("district", { required: "District is required" })} />
                            {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
                        </div>

                        <div className="form-control">
                            <label className="label">Crime Time</label>
                            <input type="datetime-local" className="input input-bordered"
                                {...register("crimeTime", { required: "Crime time is required" })} />
                            {errors.crimeTime && <p className="text-red-500 text-sm">{errors.crimeTime.message}</p>}
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Report as Anonymous</span>
                                <input type="checkbox" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} className="checkbox" />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label">Upload Images</label>
                            <input type="file" multiple accept="image/*" className="file-input file-input-bordered w-full"
                                onChange={handleFileSelect} />
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="relative">
                                    <img src={URL.createObjectURL(file)} alt="Selected" className="w-16 h-16 object-cover rounded" />
                                    <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
                                        onClick={() => handleRemoveImage(index)}>X</button>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="btn btn-primary w-full">Create Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
