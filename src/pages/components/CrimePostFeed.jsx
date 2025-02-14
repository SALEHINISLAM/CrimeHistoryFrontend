import React, { useState } from "react";
import { useGetAllCrimesQuery, useVoteCrimePostMutation } from "../../redux/features/crimes/crimes.api";
import { uploadToCloudinary } from "../../utilis/cloudinaryUploads";
import { useCreateCommentMutation } from "../../redux/features/comments/comment.api";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { optimisticAddComment, optimisticVote, rollbackAddComment, rollbackVote } from "../../redux/features/crimes/crimeSlice";

export default function CrimePostFeed({ user_id = null }) {
    const [page, setPage] = useState(1);
    const [expandedPost, setExpandedPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { data, isLoading, error } = useGetAllCrimesQuery({ page, limit: 10 });
    const [voteCrimePost] = useVoteCrimePostMutation();
    const [createComment] = useCreateCommentMutation();
    const dispatch=useAppDispatch()
    const crimes = useAppSelector((state) => state.crimes.crimes);
    const handleToggleComments = (reportId) => {
        setExpandedPost(expandedPost === reportId ? null : reportId);
    };

    const handleImageClick = (imageUrl) => {
        setEnlargedImage(imageUrl);
    };

    const handleCloseEnlargedImage = () => {
        setEnlargedImage(null);
    };

    if (isLoading) return (
        <div className="flex w-52 flex-col gap-4">
            <div className="skeleton h-[75%] w-full"></div>
            <div className="skeleton h-[5%] w-28"></div>
            <div className="skeleton h-[5%] w-full"></div>
            <div className="skeleton h-[5%] w-full"></div>
        </div>
    );

    if (error) return <div className="text-center text-red-500">Failed to load posts</div>;

    const response = data?.response;

    const handleRemoveImage = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };
    const handleFileSelect = (event) => {
        const files = event.target.files[0]
        setSelectedFiles([...selectedFiles, files]);
    };
    const handleUploadImages = async () => {
        const uploaded = await Promise.all(
            selectedFiles.map(async (file) => await uploadToCloudinary(file))
        );
        setSelectedFiles([]);
        return uploaded
    };

    const handleAddComment = async (reportId) => {
        if (!newComment.trim()) return;
        const proofImageURLs = await handleUploadImages()
        const tempCommentId = Date.now();
        const commentData = {
            comment: newComment,
            proof_image_urls: proofImageURLs,
        };
        dispatch(
            optimisticAddComment({
              report_id: reportId,
              comment: newComment,
              proof_image_urls: selectedFiles.map((file) => URL.createObjectURL(file)), 
              user_id, 
              userName: "My Comment", // Replace with the actual user's name
            })
          );
        console.log(`Adding comment to post ${reportId}:`, commentData);
        try {
            await createComment({ report_id: reportId, body: commentData }).unwrap();
            console.log("Comment added successfully");
            setNewComment("");
            toast.success("Comment added successfully");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment");
            dispatch(
                rollbackAddComment({
                  report_id: reportId,
                  comment_id: tempCommentId,
                })
              );
        }
    };

    const handleVote = async (voteType, report_id) => {
        const patchResult = dispatch(
         optimisticVote({ report_id, vote_type: voteType, user_id })
        );
      
        try {
          await voteCrimePost({ report_id, vote_type: voteType }).unwrap();
          toast.success("Successfully voted");
        } catch (error) {
          toast.error("Failed to update vote");
          dispatch(rollbackVote({ report_id, vote_type: voteType, user_id }))
        }
      };

    return (
        <div className="max-w-2xl mx-auto p-4">
            {response?.data?.formattedCrimeReports?.map((crime) => (
                <div key={crime.report_id} className="card bg-base-100 shadow-lg mb-4">
                    <div className="card-body">
                        <h2 className="card-title text-xl">{crime.title}</h2>
                        <p className="text-sm text-gray-500">{new Date(crime.crime_time).toLocaleString()}</p>
                        <p className="text-gray-700">{crime.description}</p>
                        {crime.image_urls?.length > 0 && (
                            <figure className="grid grid-cols-2 gap-2 mt-2">
                                {crime.image_urls.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt="Crime Image"
                                        className="w-full h-48 object-cover rounded-lg cursor-pointer"
                                        onClick={() => handleImageClick(image)}
                                    />
                                ))}
                            </figure>
                        )}
                        <div className="flex justify-between items-center mt-3">
                            <p className="text-sm text-gray-500">📍{crime?.name}, {crime.district}, {crime.division}</p>
                            <div className="flex gap-2">
                                <button className={`btn btn-sm btn-outline ${user_id && crime?.upVotes?.includes(user_id) && "btn-primary bg-blue-400 text-white"}`} onClick={() => handleVote(crime?.upVotes?.includes(user_id)? "noVote" : "upVote", crime?.report_id) }>👍 {crime.upVotes.length}</button>
                                <button className={`btn btn-sm btn-outline ${user_id && crime?.downVotes?.includes(user_id) && "btn-primary bg-red-400 text-white"}`} onClick={() => handleVote(crime?.upVotes?.includes(user_id)? "noVote" : "downVote", crime?.report_id,) }>👎 {crime.downVotes.length}</button>
                            </div>
                        </div>
                    </div>
                    {/* Toggle Comments Button */}
                    <button className="btn btn-sm btn-outline mt-3" onClick={() => handleToggleComments(crime.report_id)}>
                        {expandedPost === crime.report_id ? "Hide Comments" : "View Comments"}
                    </button>
                    {/* Comments Section */}
                    {expandedPost === crime.report_id && (
                        <div className="mt-4 px-1 border-t pt-2">
                            <h3 className="text-md font-semibold">Comments:</h3>
                            <ul className="mt-2">
                                {crime.comments.length > 0 ? (
                                    crime.comments.map((comment) => (
                                        <li key={comment.comment_id} className="mt-2 p-2 border rounded-md">
                                            <p className="text-sm font-semibold">{comment?.commentUserName}</p>
                                            <p className="text-sm text-gray-700">{comment?.comment}</p>
                                            {comment?.proof_image_urls && comment.proof_image_urls?.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt="Crime Image"
                                                    className="w-full h-48 object-cover mt-2 rounded-lg cursor-pointer"
                                                    onClick={() => handleImageClick(image)}
                                                />
                                            ))}
                                            <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No comments yet.</p>
                                )}
                            </ul>

                            {/* add new comment */}
                            <div className="p-2 mt-3 flex gap-2 flex-col">
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    className="input input-sm input-bordered w-full"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="file-input file-input-sm w-full"
                                    onChange={handleFileSelect}
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="relative">
                                            <img src={URL.createObjectURL(file)} alt="Selected" className="w-16 h-16 object-cover rounded" />
                                            <button className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full" onClick={() => handleRemoveImage(index)}>X</button>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-sm btn-primary" onClick={() => handleAddComment(crime.report_id)}>Post</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="text-lg font-semibold">Page {page} of {response?.data?.totalPages}</span>
                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setPage((prev) => (prev < data?.totalPages ? prev + 1 : prev))}
                    disabled={page >= data?.totalPages}
                >
                    Next
                </button>
            </div>

            {/* Enlarged Image Modal */}
            {enlargedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="relative">
                        <img src={enlargedImage} alt="Enlarged Crime" className="max-w-full max-h-screen rounded-lg" />
                        <button
                            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
                            onClick={handleCloseEnlargedImage}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}