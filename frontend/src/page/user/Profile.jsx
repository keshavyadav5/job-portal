import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
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
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant';

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [profilePhotoDialogOpen, setProfilePhotoDialogOpen] = useState(false)
  const { user } = useSelector(store => store.auth);

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
      <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className="h-24 w-24 cursor-pointer" onClick={()=> setProfilePhotoDialogOpen(true)} >
              <AvatarImage
                src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                alt="profile"
              />
            </Avatar>
            <div>
              <h1 className='font-bold text-xl'>{capitalize(user?.fullname)}</h1>
              <p>{user?.profile?.bio}</p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
            <Pen />
          </Button>
        </div>

        <div className='my-5'>
          <div className='flex items-center gap-3 my-2'>
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className='flex items-center gap-3 my-2'>
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
        </div>

        <div className='my-5'>
          <h1 className='text-md font-bold'>Skills</h1>
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
      </div>

      <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
        <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
        <AppliedJobTable />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />

      <UpdateProfileImage open={profilePhotoDialogOpen} setOpen={setProfilePhotoDialogOpen} />
    </div>
  )
}

export default Profile





const UpdateProfileImage = ({ open, setOpen }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const res = await axios.put(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
