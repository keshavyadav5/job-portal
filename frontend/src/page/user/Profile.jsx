import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CircleCheckBig, Contact, Mail, Pen, SquarePen, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import AppliedJobTable from './AppliedJobTable'
import { useDispatch, useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import Navbar from '@/components/shared/Navbar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import UpdateProfileDialog from './UpdateProfileDialog '

// for profile image
import { setUser } from '@/redux/authSlice'
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Footer from '@/components/shared/Footer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateProfileMutation } from '@/utils/api/userApiSlice'



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

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [profilePhotoDialogOpen, setProfilePhotoDialogOpen] = useState(false)
  const { user } = useSelector(store => store.auth);
  const [niche, setNiche] = useState(false)
  const [firstNiche, setFirstNiche] = useState(user?.niches?.firstNiche || "");
  const [secondNiche, setSecondNiche] = useState(user?.niches?.secondNiche || "");
  const [thirdNiche, setThirdNiche] = useState(user?.niches?.thirdNiche || "");
  const dispatch = useDispatch();

  const getAvailableNiches = (exclude = []) =>
    nichesArray.filter((niche) => !exclude.filter(Boolean).includes(niche));

  useEffect(() => {
    if (user?.niches) {
      setFirstNiche(user.niches.firstNiche || "");
      setSecondNiche(user.niches.secondNiche || "");
      setThirdNiche(user.niches.thirdNiche || "");
    }
  }, [user?.niches?.firstNiche, user?.niches?.secondNiche, user?.niches?.thirdNiche]);

  const [updateProfile, { isLoading: loading }] = useUpdateProfileMutation()

  const handleUpadteNiche = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstNiche", firstNiche);
    formData.append("secondNiche", secondNiche);
    formData.append("thirdNiche", thirdNiche);

    try {
      const res = await updateProfile(formData).unwrap();
      if (res.success) {
        dispatch(setUser(res?.user));
        setFirstNiche(res?.user?.niches?.firstNiche);
        setSecondNiche(res?.user?.niches?.secondNiche);
        setThirdNiche(res?.user?.niches?.thirdNiche);
        toast.success(res?.message);
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.message || "Something went wrong");
    }
    finally {
      setNiche(false)
    }
  }
  function capitalize(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const isResume = Boolean(user?.profile?.resume);

  return (
    <div>
      <Navbar />
      <div className='max-w-3xl lg:max-w-4xl md:mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 mt-20 mx-4 relative shadow'>
        <div className='flex justify-between'>
          <div className='flex items-left flex-col md:flex-row md:items-center gap-4'>
            <Avatar className="h-24 w-24 cursor-pointer" onClick={() => setProfilePhotoDialogOpen(true)} >
              <AvatarImage
                src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                alt="profile"
              />
            </Avatar>
            <div>
              <span className='flex gap-1 items-center'><h1 className='font-bold text-xl'>{capitalize(user?.fullname)}</h1> {user?.isVerified ? <CircleCheckBig className='text-green-600 font-bold' size={12} /> : <X className='text-red-600 font-bold' size={12} />}</span>
              <p className='text-justify'>{user?.profile?.bio || "Add bio..."}</p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} className="text-right absolute top-2 right-2" variant="outline">
            <Pen />
          </Button>
        </div>

        <div className='my-5'>
          <div className='flex items-center gap-3 my-2 bg-slate-50 p-1 rounded sm:max-w-xs'>
            <Mail />
            <span className='font-medium text-gray-600 w-full h-full '>{user?.email}</span>
          </div>
          <div className='flex items-center gap-3 my-2 bg-slate-50 p-1 rounded sm:max-w-xs'>
            <Contact />
            <span className='font-medium text-gray-600 w-full h-full'>{user?.phoneNumber || "Add your Contact number"}</span>
          </div>
        </div>
        {user?.role === "student" &&
          <>
            <div className='my-5'>
              <h1 className='text-md font-bold mb-3'>Skills</h1>
              <div className='flex items-center gap-1 flex-wrap'>
                {user?.profile?.skills?.length > 0
                  ? user.profile.skills.map((item, index) => <Badge key={index}>{item}</Badge>)
                  : <span>NA</span>}
              </div>
            </div>

            <div className='grid w-full max-w-sm items-center gap-1.5'>
              <Label className="text-md font-bold">Resume</Label>
              {isResume
                ? <a target='_blank' rel="noopener noreferrer" href={user.profile.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user.profile.resumeOriginalName}</a>
                : <span>NA</span>}
            </div>
          </>
        }

        <form onSubmit={handleUpadteNiche}>
          {user?.role === "student" && (
            <>
              <div className="flex flex-row gap-3 mt-5 items-center">
                <Label className="text-md font-bold">Niches</Label>
                <SquarePen size={16} className='cursor-pointer text-purple-500' onClick={() => setNiche(!niche)} />
              </div>
              <div className='flex flex-col md:flex-row items-center justify-between'>
                <div className='flex flex-col gap-2 items-start mt-3'>
                  <Label>First Niche</Label>
                  <Select value={firstNiche || undefined} onValueChange={setFirstNiche} disabled={!niche}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select first niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableNiches([secondNiche, thirdNiche]).map((nicheItem) => (
                        <SelectItem key={nicheItem} value={nicheItem}>
                          {nicheItem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex flex-col gap-2 items-start mt-3'>
                  <Label>Second Niche</Label>
                  <Select value={secondNiche || undefined} onValueChange={setSecondNiche} disabled={!niche}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select second niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableNiches([firstNiche, thirdNiche]).map((nicheItem) => (
                        <SelectItem key={nicheItem} value={nicheItem}>
                          {nicheItem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex flex-col gap-2 items-start mt-3'>
                  <Label>Third Niche</Label>
                  <Select value={thirdNiche || undefined} onValueChange={setThirdNiche} disabled={!niche}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select third niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableNiches([firstNiche, secondNiche]).map((nicheItem) => (
                        <SelectItem key={nicheItem} value={nicheItem}>
                          {nicheItem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>

          )}
          {niche && (
            <Button type='submit' className='mt-2 bg-purple-800 hover:bg-purple-900 cursor-pointer'>
              Update Niche
            </Button>
          )}
        </form>
      </div>
      {
        user?.role === "recruiter" && <div className='mt-92'></div>
      }
      {
        user?.role === '!student' &&
        <div className='max-w-3xl lg:max-w-4xl md:mx-auto mx-4 bg-white rounded-2xl my-10'>
          <h1 className='font-bold text-xl my-5'>Applied Jobs</h1>
          <AppliedJobTable />
        </div>
      }

      <UpdateProfileDialog open={open} setOpen={setOpen} updateProfile={updateProfile} loading={loading} />

      <UpdateProfileImage open={profilePhotoDialogOpen} setOpen={setProfilePhotoDialogOpen} updateProfile={updateProfile} loading={loading} />
      <Footer />
    </div>
  )
}

export default Profile





const UpdateProfileImage = ({ open, setOpen, updateProfile, loading }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!profileImage) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("profilePhoto", profileImage);

    try {
      const res = await updateProfile(formData).unwrap()
      if (res.success) {
        dispatch(setUser(res.user));
        toast.success(res.message);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">Image</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={onChangeHandler}
                className="col-span-3"
              />
            </div>

            {preview && (
              <div className="col-span-4 flex justify-center">
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full my-4" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
