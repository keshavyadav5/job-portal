import React, { useEffect, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useUpdateCompanyMutation } from '@/utils/api/companySlice'
import { useLazyGetCompanyByIdQuery } from '@/utils/api/companySlice'

const CompanySetup = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  const [getCompanyById, { data, isLoading: fetchLoading }] = useLazyGetCompanyByIdQuery();
  const [updateCompany, { isLoading: updateLoading }] = useUpdateCompanyMutation();

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logo: null
  });

  // Fetch company data on mount
  useEffect(() => {
    if (params.id) {
      getCompanyById(params.id);
    }
  }, [params.id, getCompanyById]);

  // Update form when data is loaded
  useEffect(() => {
    if (data) {
      const company = data.company || data;
      setInput({
        name: company?.name || "",
        description: company?.description || "",
        website: company?.website || "",
        location: company?.location || "",
        logo: null 
      });
    }
  }, [data]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const logo = e.target.files?.[0];
    setInput({ ...input, logo });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);

    if (input.logo) {
      formData.append("logo", input.logo);
    }

    try {
      const companyId = params.id;  
      const res = await updateCompany({ formData, companyId }).unwrap();

      if (res.success) {
        toast.success(res.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // Show loading state while fetching
  if (fetchLoading) {
    return (
      <div>
        <Navbar />
        <div className='max-w-xl mx-auto my-10 text-center'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto' />
          <p className='mt-2 text-gray-500'>Loading company details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='max-w-3xl mx-4 md:mx-auto my-20'>
        <form onSubmit={submitHandler}>
          <div className='flex items-center gap-5 pb-8 mt-5'>
            <Button
              type="button"
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className='font-bold text-xl'>Company Setup</h1>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <Label className='mb-1'>Company Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                required
              />
            </div>

            <div>
              <Label className='mb-1'>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label className='mb-1'>Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label className='mb-1'>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label className='mb-1'>Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
            </div>
          </div>

          {updateLoading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Update
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;