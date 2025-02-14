import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    crimes: [], // List of crimes
    loading: false, // Loading state
    error: null, // Error state
};

const crimesSlice = createSlice({
    name: "crimes",
    initialState,
    reducers: {
        // Action to set crimes (e.g., after fetching)
        setCrimes: (state, action) => {
            state.crimes = action.payload;
        },
        // Action to set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // Action to set error state
        setError: (state, action) => {
            state.error = action.payload;
        },
        // Action to optimistically update votes
        optimisticVote: (state, action) => {
            const { report_id, vote_type, user_id } = action.payload;
            const crime = state.crimes.find((crime) => crime.report_id === report_id);
            if (crime) {
                if (vote_type === "upVote") {
                    crime.upVotes.push(user_id);
                } else if (vote_type === "downVote") {
                    crime.downVotes.push(user_id);
                }
            }
        },
        //addComment
        optimisticAddComment: (state, action) => {
            const { report_id, comment, proof_image_urls, user_id, userName } = action.payload;
            const crime = state.crimes.find((crime) => crime.report_id === report_id);
            if (crime) {
                crime.comments.push({
                    comment_id: crypto.randomUUID(), // Temporary ID (replace with actual ID from API response)
                    comment,
                    proof_image_urls,
                    commentUserName: userName,
                    createdAt: new Date().toISOString(),
                });
            }
        },
        // Action to roll back optimistic updates
        rollbackVote: (state, action) => {
            const { report_id, vote_type, user_id } = action.payload;
            const crime = state.crimes.find((crime) => crime.report_id === report_id);
            if (crime) {
                if (vote_type === "upVote") {
                    crime.upVotes = crime.upVotes.filter((id) => id !== user_id);
                } else if (vote_type === "downVote") {
                    crime.downVotes = crime.downVotes.filter((id) => id !== user_id);
                }
            }
        },
        // Action to roll back optimistic updates
        rollbackAddComment: (state, action) => {
            const { report_id, comment_id } = action.payload;
            const crime = state.crimes.find((crime) => crime.report_id === report_id);
            if (crime) {
                crime.comments = crime.comments.filter((comment) => comment.comment_id !== comment_id);
            }
        },
        optimisticCreateCrimePost: (state, action) => {
            state.crimes.unshift({
                ...action.payload,
                report_id: crypto.randomUUID(), // Temporary ID until API response
                createdAt: new Date().toISOString(),
            });
        },
        // Rollback action if API fails
        rollbackCreateCrimePost: (state, action) => {
            const { report_id } = action.payload;
            state.crimes = state.crimes.filter((crime) => crime.report_id !== report_id);
        },
    },
});

export const { setCrimes, setLoading, setError, optimisticVote, rollbackVote,optimisticAddComment,rollbackAddComment,optimisticCreateCrimePost,rollbackCreateCrimePost } =
    crimesSlice.actions;

export default crimesSlice.reducer;