import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { setLoading } from "@/redux/authSlice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRegisterMutation } from "@/utils/api/userApiSlice";
import Oath from "./Oath";

const nichesArray = [
  "Software Development",
  "Web Development",
  "Cybersecurity",
  "Data Science",
  "Artificial Intelligence",
  "Cloud Computing",
  "DevOps",
  "Mobile App Development",
  "Blockchain",
  "Database Administration",
  "Network Administration",
  "UI/UX Design",
  "Game Development",
  "IoT (Internet of Things)",
  "Big Data",
  "Machine Learning",
  "IT Project Management",
  "IT Support and Helpdesk",
  "Systems Administration",
  "IT Consulting",
];

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });
  const [firstNiche, setFirstNiche] = useState("");
  const [secondNiche, setSecondNiche] = useState("");
  const [thirdNiche, setThirdNiche] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading: loading }] = useRegisterMutation();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const validateForm = () => {
    const { fullname, email, phoneNumber, password, role } = input;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      toast.error("All fields are required.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits.");
      return false;
    }

    if (role === "student" && (!firstNiche || !secondNiche || !thirdNiche)) {
      toast.error("Please select all three preferred niches.");
      return false;
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.role === "student") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
    }

    if (file) formData.append("profilePhoto", file);

    try {
      const res = await register(formData).unwrap();
      console.log(res)
      if (res.success) {
        toast.success(res.message);
        navigate("/verify-email");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getAvailableNiches = (exclude = []) =>
    nichesArray.filter((niche) => !exclude.includes(niche));

  return (
    <div>
      <Navbar />
      <div className={`flex items-center flex-col justify-center min-h-screen bg-gray-50 ${input.role === 'student' ? "my-20" : "my-0"}`}>
        <div className="w-full max-w-md bg-white shadow-md rounded-xl border border-gray-200 p-6 space-y-5">
          <form
            onSubmit={submitHandler}
            className="w-full space-y-5"
          >
            <h1 className="text-2xl font-bold text-center">Create an Account</h1>

            {/* Fullname */}
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="John Doe"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

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

            {/* Phone */}
            <div className="space-y-1">
              <Label>Phone Number</Label>
              <Input
                type="number"
                value={input.phoneNumber}
                name="phoneNumber"

                onChange={changeEventHandler}
                placeholder="9876543210"
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

            {/* Role & File */}
            <div className="flex justify-between gap-4 flex-col-reverse">
              <RadioGroup className="flex items-center gap-4">
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

              <div className="flex flex-col gap-1">
                <Label>Profile</Label>
                <Input
                  accept="image/*"
                  type="file"
                  onChange={onChangeHandler}
                  className="cursor-pointer text-sm"
                />
              </div>
            </div>

            {/* Niche dropdowns (students only) */}
            {input.role === "student" && (
              <div className="space-y-3">
                <Label>First Niche</Label>
                <Select value={firstNiche} onValueChange={setFirstNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableNiches([secondNiche, thirdNiche]).map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>Second Niche</Label>
                <Select value={secondNiche} onValueChange={setSecondNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableNiches([firstNiche, thirdNiche]).map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>Third Niche</Label>
                <Select value={thirdNiche} onValueChange={setThirdNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select third niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableNiches([firstNiche, secondNiche]).map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Submit Button */}
            {loading ? (
              <Button className="w-full bg-gray-700 text-white hover:bg-gray-800 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-gray-700 text-white hover:bg-gray-800"
              >
                Sign Up
              </Button>
            )}
          </form>
          <div className="flex flex-col gap-2">
            <Oath />
            {/* Redirect */}
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
