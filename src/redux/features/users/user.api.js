import { baseApi } from "../../api/baseApi";

const generalUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (args) => {
        console.log("Fetching Users with args:", args);
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: '/users',
          method: 'GET',
          params: params,
        };
      },
      transformResponse: (response) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    getMe:builder.query({
      query:()=>({
        url:"/users/get-me",
        method:'GET',
      }),
    })
    ,
    addUser: builder.mutation({
      query: (data) => ({
        url: '/users/create-user',
        method: 'POST',
        body: data,
      }),
    }),
    getTopContributors: builder.query({
      query: () => ({
        url: "/users/top-contributors",
        method: "GET",
      }),
      transformResponse: (response) => response, 
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useAddUserMutation,
  useGetMeQuery,
  useGetTopContributorsQuery,
} = generalUserApi;
