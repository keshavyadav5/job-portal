import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant";
import { setUser } from "@/redux/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const baseQueryWithAuthHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle 401 globally
  // console.log("result",result)
  if (result.error && result.error.status === 401) {
    // api.dispatch(setUser(null)); // clear user state
    // optionally navigate to login here, or handle in component
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["User", "Company", "Job", "Applicant"],
  endpoints: () => ({}),
});
