import { useEffect } from "react";
import { baseApi } from "../../api/baseApi";

const crimesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCrimes: builder.query({
      query: ({ page = 1, limit = 10, searchQuery, district, division }) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (searchQuery) params.append("searchQuery", searchQuery);
        if (district) params.append("district", district);
        if (division) params.append("division", division);

        return {
          url: "/crimes/get-post",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response) => {
        return  response?.data?.formattedCrimeReports || [];
      },
      providesTags: ["Crimes"],
    }),

    getCrimeById: builder.query({
      query: (report_id) => ({
        url: `/crimes/get-single-post?report_id=${report_id}`,
        method: "GET",
      }),
      providesTags: (result, error, report_id) => [{ type: "Crime", id: report_id }],
    }),

    addCrimeReport: builder.mutation({
      query: (data) => ({
        url: "/crimes/create-crime-post",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Crimes"]
    }),

    voteCrimePost: builder.mutation({
      query: ({ report_id, vote_type }) => ({
        url: `/crimes/vote-post?report_id=${report_id}`,
        method: "POST",
        body: { vote_type: vote_type },
      }),
      invalidatesTags: (result, error, { report_id }) => [
        { type: "Crime", id: report_id }, // Invalidate the specific crime post
        "Crimes", // Invalidate the list of crimes
      ],
    })
  }),
});

export const {
  useGetAllCrimesQuery,
  useGetCrimeByIdQuery,
  useAddCrimeReportMutation,
  useVoteCrimePostMutation,
} = crimesApi;
