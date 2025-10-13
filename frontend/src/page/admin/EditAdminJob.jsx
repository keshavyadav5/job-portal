import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Niche options
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

// Job Type options
const jobTypes = ["Full Time", "Part Time", "Work on Contract"];

const EditAdminJob = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Handle input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle company selection
  const selectCompanyHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany?._id });
  };

  // Fetch job details on mount
  useEffect(() => {
    const fetchJobById = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, {
          withCredentials: true,
        });
        if (res.data.success && res.data.job) {
          const job = res.data.job;

          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements?.join(", ") || "",
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "",
            experience: job.experienceLevel || "",
            position: job.position || 0,
            companyId: job.companyId || "",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    fetchJobById();
  }, [params.id]);

  // Submit update
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.companyId) {
      toast.error("Please select a company before updating the job.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`${JOB_API_END_POINT}/update/${params.id}`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-20">
        <form
          onSubmit={submitHandler}
          className="p-8 w-[700px] border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Niche / Job Title */}
            <div>
              <Label>Niche / Job Title</Label>
              <Select
                value={input.title}
                onValueChange={(value) => setInput({ ...input, title: value })}
              >
                <SelectTrigger className="w-full my-1">
                  <SelectValue placeholder="Select a niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {nichesArray.map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Job Type */}
            <div>
              <Label>Job Type</Label>
              <Select
                value={input.jobType}
                onValueChange={(value) => setInput({ ...input, jobType: value })}
              >
                <SelectTrigger className="w-full my-1">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {/* Requirements */}
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="Comma-separated skills required"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {/* Salary */}
            <div>
              <Label>Salary</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {/* Location */}
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {/* Experience */}
            <div>
              <Label>Experience Level (in years)</Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {/* Positions */}
            <div>
              <Label>No. of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {/* Company Select */}
            {companies.length > 0 && (
              <div>
                <Label>Company</Label>
                <Select
                  value={companies.find(c => c._id === input.companyId)?.name?.toLowerCase() || ""}
                  onValueChange={selectCompanyHandler}
                >
                  <SelectTrigger className="w-full my-1">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Submit */}
          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Update Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditAdminJob;
