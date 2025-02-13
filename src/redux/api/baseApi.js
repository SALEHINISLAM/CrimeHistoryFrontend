import { fetchBaseQuery,createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set('authorization', `${token}`);
        }

        return headers;
    }
})

const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 404) {
        toast.error(result.error.data.message); // Ensure `toast` is imported and configured
    }

    if (result?.error?.status === 401) {
        console.log('Sending refresh token');

        const res = await fetch('http://localhost:5000/api/v1/auth/refresh-token', {
            method: 'POST',
            credentials: 'include',
        });

        const data = await res.json();

        if (data?.data?.accessToken) {
            const user = api.getState().auth.user;

            api.dispatch(
                setUser({
                    user,
                    token: data.data.accessToken,
                })
            );

            // Retry the original request with the new token
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout()); // Ensure `logout` action is imported
        }
    }

    return result; // Always return the result
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithRefreshToken,
    endpoints: () => ({}),
});