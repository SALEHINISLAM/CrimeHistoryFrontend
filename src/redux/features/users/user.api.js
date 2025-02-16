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
    editProfile:builder.mutation({
      query: (data) => ({
        url: "/verified-users/edit-profile",
        method: "PATCH",
        body: data,
      }),
    }),
    verifyCode:builder.mutation({
      query: (data) => ({
        url: "/users/verify-code",
        method: "POST",
        body: data,
      }),
    }),
    sendVerifyCode:builder.mutation({
      query: () => ({
        url: "/users/verify-user",
        method: "POST",
      }),
    }),
    forgotPasswordCode:builder.mutation({
      query: (email) => ({
        url: "/users/forget-password",
        method: "POST",
        body: email,
      }),
    }),
    verifyCodeAndResetPassword: builder.mutation({
      query: ({ email, code, password }) => ({
        url: '/users/reset-password',
        method: 'POST',
        body: { email, code, password:password },
      }),
    }),
    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: { oldPassword, newPassword },
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useAddUserMutation,
  useGetMeQuery,
  useGetTopContributorsQuery,
  useEditProfileMutation,
  useVerifyCodeMutation,
  useSendVerifyCodeMutation,
  useForgotPasswordCodeMutation,
  useVerifyCodeAndResetPasswordMutation,
  useChangePasswordMutation,
} = generalUserApi;
