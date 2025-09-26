import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './page/Home/Home'
import Jobs from './page/Jobs/Jobs'
import Profile from './page/user/Profile'
import JobDescription from './page/Jobs/JobDescription'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
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
  }
])

const App = () => {
  return (
    <RouterProvider router={appRouter}>

    </RouterProvider>
  )
}

export default App