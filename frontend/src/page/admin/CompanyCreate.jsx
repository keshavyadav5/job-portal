import React, { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { useRegisterCompanyMutation } from '@/utils/api/companySlice'

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const dispatch = useDispatch();

  const [registerCompany, { isLoading }] = useRegisterCompanyMutation();
  
  const registerNewCompany = async () => {
    if (!companyName || companyName.trim() === '') {
      toast.error('Please enter a company name');
      return;
    }

    try {
      const res = await registerCompany({ companyName }).unwrap();
      
      if (res?.success) {
        dispatch(setSingleCompany(res.company));
        toast.success(res.message);
        const companyId = res?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <Navbar />
      <div className='max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-4 md:mx-auto my-20'>
        <div className='my-10'>
          <h1 className='font-bold text-2xl'>Your Company Name</h1>
          <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
        </div>

        <Label>Company Name</Label>
        <Input
          type="text"
          className="my-2"
          placeholder="JobHunt, Microsoft etc."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <div className='flex items-center gap-2 my-10'>
          <Button variant="outline" onClick={() => navigate("/admin/companies")}>
            Cancel
          </Button>
          <Button onClick={registerNewCompany} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CompanyCreate