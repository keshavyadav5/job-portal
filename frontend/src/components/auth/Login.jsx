import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { setUser } from '@/redux/authSlice'
import { useLoginMutation } from '@/utils/api/userApiSlice'
import Oath from './Oath'

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: loading }] = useLoginMutation();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login(input).unwrap();
      if (res.success) {
        dispatch(setUser(res.user))
        toast.success(res.message);
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl border border-gray-200 p-6 space-y-5">
          <form
            onSubmit={submitHandler}
            className="w-full space-y-5"
          >
            <h1 className="text-2xl font-bold text-center">Login</h1>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="john@gmail.com"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="••••••••"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <RadioGroup className="flex items-center gap-6 my-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <span>Student</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <span>Recruiter</span>
              </label>
            </RadioGroup>

            {/* Button */}
            {loading ? (
              <Button className="w-full bg-gray-700 text-white hover:bg-gray-800 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-gray-700 text-white hover:bg-gray-800 cursor-pointer transition-all duration-300">
                Login
              </Button>
            )}
          </form>
          <div className='flex flex-col gap-2'>
            <Oath />
            {/* Redirect */}
            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
