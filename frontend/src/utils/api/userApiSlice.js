import { apliSlice } from "./apiSlice";
import { USER_API_END_POINT } from '../constant'

export const userApiSlice = apliSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_API_END_POINT}/register`,
        method: "POST",
        body: data,
        credentials: 'include',
      }),
    }),

    googleLogin: builder.mutation({
      query: (data) => ({
        url: `${USER_API_END_POINT}/google`,
        method: "POST",
        body: data,
      })
    }),

    login: builder.mutation({
      query: (data) => ({
        url: `${USER_API_END_POINT}/login`,
        method: 'POST',
        body: data,
      })
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USER_API_END_POINT}/logout`,
        method: 'POST'
      })
    }),


  })
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
} = userApiSlice