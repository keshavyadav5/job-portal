import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, Menu, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'


// mobile navbar 
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from '@radix-ui/react-label'

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }


  function capitalize(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 720) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className='flex items-center xlg:px-20 px-10 md:px-20 justify-between mx-auto max-w-7xl h-16'>
        <div>
          <Link to={'/'} className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></Link>
        </div>
        <div className='items-center gap-12 hidden md:flex'>
          <ul className='flex font-medium items-center gap-5'>
            {
              user && user.role === 'recruiter' ? (
                <>
                  <li><Link to="/admin/companies">Companies</Link></li>
                  <li><Link to="/admin/jobs">Jobs</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/jobs">Jobs</Link></li>
                  <li><Link to="/browse">Browse</Link></li>
                </>
              )
            }


          </ul>
          {
            !user ? (
              <div className='flex items-center gap-2'>
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
              </div>
            ) : (
              <Popover >
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="@shadcn" />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className=''>
                    <div className='flex gap-2 space-y-2'>
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="@shadcn" />
                      </Avatar>
                      <div>
                        <h4 className='font-medium'>{capitalize(user?.fullname)}</h4>
                        <p className='text-sm text-muted-foreground truncate'>{user?.profile?.bio}</p>
                      </div>
                    </div>
                    <div className='flex flex-col my-2 text-gray-600'>
                      {
                        user && user.role === 'student' && (
                          <div className='flex w-fit items-center gap-2 cursor-pointer'>
                            <User2 />
                            <Button variant="link" className="focus:outline-none border-none">
                              <Link to="/profile">View Profile</Link>
                            </Button>
                          </div>
                        )
                      }

                      <div className='flex w-fit items-center gap-2 cursor-pointer'>
                        <LogOut />
                        <Button className={'cursor-pointer'} onClick={logoutHandler} variant="link">Logout</Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )
          }

        </div>
        <div className='flex md:hidden'>
          {
            user ?
              <Menu onClick={() => { setOpen(!open) }} />
              : <div className='flex items-center gap-2'>
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
              </div>
          }
        </div>


      </div>
      <MobileNavbar open={open} setOpen={setOpen} user={user} logoutHandler={logoutHandler} capitalize={capitalize} />
    </div>
  )
}

export default Navbar



const MobileNavbar = ({ open, setOpen, user, logoutHandler, capitalize }) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <h1 className='font-bold text-2xl'>Profile</h1>
          <hr />
        </SheetHeader>
        <div className='mx-5'>
          <div className="flex gap-2 items-center">
            <div className='w-[15%] h-14 flex items-center justify-center'>
              <img
                src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"}
                alt={user?.fullname || "User"}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
            <div className='px-4 w-[85%]'>
              <h2 className="font-semibold">
                {user?.fullname ? capitalize(user.fullname) : "Anonymous"}
              </h2>
              <p className="text-sm text-gray-500">
                {user?.profile?.bio
                  ? user.profile.bio.length > 100
                    ? `${user.profile.bio.substring(0, 100)}...`
                    : user.profile.bio
                  : "No bio available"}
              </p>
            </div>
          </div>

          <ul className="flex flex-col gap-3 text-lg my-5">
            {user && user.role === "recruiter" ? (
              <>
                <li className='bg-slate-100 w-full h-full p-2 rounded-sm'>
                  <Link to="/admin/companies" onClick={() => setOpen(false)}>Companies</Link>
                </li>
                <li className='bg-slate-100 w-full h-full p-2 rounded-sm'>
                  <Link to="/admin/jobs" onClick={() => setOpen(false)}>Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li className='bg-slate-100 w-full h-full p-2 rounded-sm'>
                  <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                </li>
                <li className='bg-slate-100 w-full h-full p-2 rounded-sm'>
                  <Link to="/jobs" onClick={() => setOpen(false)}>Jobs</Link>
                </li>
                <li className='bg-slate-100 w-full h-full p-2 rounded-sm'>
                  <Link to="/browse" onClick={() => setOpen(false)}>Browse</Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)}>
                <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {user.role === "student" && (
                <Link to="/profile" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <User2 size={18} /> View Profile
                  </Button>
                </Link>
              )}
              <Button
                onClick={() => { logoutHandler(); setOpen(false); }}
                variant="destructive"
                className="w-full flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </Button>
            </div>
          )}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="w-full mt-6">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet >
  );
};
