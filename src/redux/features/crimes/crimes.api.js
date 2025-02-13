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
        return {
          response
        };
      },
    }),

    getCrimeById: builder.query({
      query: (report_id) => ({
        url: `/crimes/get-single-post?report_id=${report_id}`,
        method: "GET",
      }),
    }),

    addCrimeReport: builder.mutation({
      query: (data) => ({
        url: "/crimes/create-crime-post",
        method: "POST",
        body: data,
      }),
    }),

    voteCrimePost:builder.mutation({
      query: ({report_id,vote_type}) => ({
        
          url: `/crimes/vote-post?report_id=${report_id}`,
          method: "POST",
          body: {vote_type:vote_type},
        
      }),
    })
  }),
});

export const {
  useGetAllCrimesQuery,
  useGetCrimeByIdQuery,
  useAddCrimeReportMutation,
  useVoteCrimePostMutation,
} = crimesApi;
