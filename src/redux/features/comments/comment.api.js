import { baseApi } from "../../api/baseApi";

const commentsApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        createComment:builder.mutation({
            query:({report_id,body})=>{
                const params=new URLSearchParams()
                params.append('report_id',report_id)
                return {
                    url: "/crimes/create-comment",
                    method: "POST",
                    params: params,
                    body:body
                  };
            },
            transformResponse: (response) => {
                return {
                  response
                };
              }
        })
    })
})

export const {
  useCreateCommentMutation
} = commentsApi;