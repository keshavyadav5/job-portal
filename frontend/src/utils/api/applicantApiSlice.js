import { apiSlice } from "./apiSlice";
import { APPLICATION_API_END_POINT } from '../constant'


export const applicantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    applyJob: builder.mutation({
      query: (jobId) => ({
        url: `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        method: "POST",
        credentials: "include",
      })
    }),

    appliedStatus: builder.mutation({
      query: (jobId) => ({
        url: `${APPLICATION_API_END_POINT}/status/${jobId}`,
        method: "POST"
      })
    })
  })
})

export const {
  useApplyJobMutation,
  useAppliedStatusMutation,
} = applicantApiSlice
