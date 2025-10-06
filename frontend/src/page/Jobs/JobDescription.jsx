import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useAppliedStatusMutation } from '@/utils/api/applicantApiSlice';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    const [appliedStatus] = useAppliedStatusMutation();

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const canApply = () => {
        if (!user?.isVerified) {
            return { canApply: false, message: "Please verify your account first" };
        }
        if (!user?.profile?.resume) {
            return { canApply: false, message: "Please upload your resume first" };
        }
        if (!user?.phoneNumber) {
            return { canApply: false, message: "Please add your contact number" };
        }
        return { canApply: true, message: "" };
    };

    const applyJobHandler = async () => {
        const eligibility = canApply();

        if (!eligibility.canApply) {
            toast.error(eligibility.message);
            return;
        }

        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...singleJob.applications, { applicant: user?._id }]
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        const fetchSingleJobStatus = async () => {
            try {
                const res = await appliedStatus(jobId).unwrap();
                if (res.success) {
                    setIsApplied(res.applied);
                }
            } catch (error) {
                console.log(error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSingleJobStatus();
    }, [jobId]);

    if (!singleJob) {
        return <p className="text-center my-10">Loading job details...</p>;
    }

    // Get button state
    const eligibility = canApply();
    const isDisabled = isApplied || loading || !eligibility.canApply;

    // Determine button text
    const getButtonText = () => {
        if (loading) return 'Loading...';
        if (isApplied) return 'Already Applied';
        if (!eligibility.canApply) return eligibility.message;
        return 'Apply Now';
    };

    return (
        <div className='max-w-3xl lg:max-w-5xl mx-4 md:mx-auto my-10'>
            <div className='flex flex-col-reverse md:flex-row items-left gap-3 sm:px-8 lg:items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.postion} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                <Button
                    onClick={applyJobHandler}
                    disabled={isDisabled}
                    className={`rounded-lg max-w-[200px] ${isDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                >
                    {getButtonText()}
                </Button>
            </div>

            <div className='px-0 sm:px-10'>
                <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
                <div className='max-w-3xl lg:max-w-5xl md:mx-auto'>
                    <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                    <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                    <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                    <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience} yrs</span></h1>
                    <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                    <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                    <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt?.split("T")[0]}</span></h1>
                </div>
            </div>
        </div>
    );
};

export default JobDescription;