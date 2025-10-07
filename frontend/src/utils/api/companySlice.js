import { apiSlice } from "./apiSlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";

export const companyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompany: builder.query({
      query: () => ({
        url: `${COMPANY_API_END_POINT}/get`,
        method: "GET",
      }),
      providesTags: ["Company"],
    }),

    getCompanyById: builder.query({
      query: (companyId) => ({
        url: `${COMPANY_API_END_POINT}/get/${companyId}`,
        method: "GET",
      }),
      providesTags: ["Company"],
    }),

    deleteCompany: builder.mutation({
      query: (companyId) => ({
        url: `${COMPANY_API_END_POINT}/delete/${companyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Company"],
    }),

    registerCompany: builder.mutation({
      query: (data) => ({
        url: `${COMPANY_API_END_POINT}/register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),

    updateCompany: builder.mutation({
      query: ({ formData, companyId }) => ({
        url: `${COMPANY_API_END_POINT}/update/${companyId}`,
        method: "PUT",
        body: formData
      }),
      invalidatesTags: ["Company"]
    })
  }),
});

export const {
  useGetAllCompanyQuery,
  useLazyGetCompanyByIdQuery,
  useDeleteCompanyMutation,
  useRegisterCompanyMutation,
  useUpdateCompanyMutation,
} = companyApiSlice;
