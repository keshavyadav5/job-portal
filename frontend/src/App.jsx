import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './page/Home/Home'
import Jobs from './page/Jobs/Jobs'
import Profile from './page/user/Profile'
import JobDescription from './page/Jobs/JobDescription'
import Browse from './page/Jobs/Browse'
import ProtectedRoute from './page/admin/ProtectedRoute'
import Companies from './page/admin/Companies'
import CompanyCreate from './page/admin/CompanyCreate'
import CompanySetup from './page/admin/CompanySetup'
import AdminJobs from './page/admin/AdminJobs'
import PostJob from './page/admin/PostJob'
import Applicants from './page/admin/Applicants'
import AuthLayout from './components/auth/AuthLayout'
import VerifyEmail from './components/auth/VerifyEmail'
import Verify from './components/auth/Verify'
import ForgotPassword from './components/auth/ForgotPassword'
import VerifyOTP from './components/auth/VerifyOTP'
import ChangePassword from './components/auth/ChangePassword'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <AuthLayout><Login /></AuthLayout>
  },
  {
    path: '/signup',
    element: <AuthLayout><Signup /></AuthLayout>
  },
  {
    path: '/forgot-password',
    element: <AuthLayout><ForgotPassword /></AuthLayout>
  },
  {
    path: '/verify-email',
    element: <AuthLayout><VerifyEmail /></AuthLayout>
  },
  {
    path: '/verify',
    element: <AuthLayout> <Verify /></AuthLayout>
  },
  {
    path: '/verify-otp/:email',
    element: <AuthLayout><VerifyOTP /></AuthLayout>
  },
  {
    path: '/change-password/:email',
    element: <AuthLayout><ChangePassword /></AuthLayout>
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/description/:id',
    element: <JobDescription />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  // admin ke liye yha se start hoga
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
])

const App = () => {
  return (
    <RouterProvider router={appRouter}>

    </RouterProvider>
  )
}

export default App