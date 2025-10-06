import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant";

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  credentials: "include", 
});

export const apliSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Company', 'Job', 'Applicant'],
  endpoints: () => ({})
})