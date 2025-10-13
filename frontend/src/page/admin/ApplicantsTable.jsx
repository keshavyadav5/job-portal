import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const [applicants, setApplicant] = useState([]);
  const [update, setUpdate] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/application/${params?.id}/applicants`, { withCredentials: true });
        if (res.data.succees) setApplicant(res?.data?.job?.applications);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAppliedJobs();
  }, [update]);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
        setUpdate(prev => !prev);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Applied On</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {applicants?.map((item) => (
          <TableRow key={item._id}>
            <TableCell>{item?.applicant?.fullname}</TableCell>
            <TableCell>{item?.applicant?.email}</TableCell>
            <TableCell>{item?.applicant?.phoneNumber}</TableCell>
            <TableCell className={`${item?.status === 'accepted' ? 'text-green-500' : 'text-red-500'} font-semibold`}>
              {item?.status}
            </TableCell>
            <TableCell>
              {item.applicant?.profile?.resume ? (
                <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                  {item?.applicant?.profile?.resumeOriginalName}
                </a>
              ) : (
                <span>NA</span>
              )}
            </TableCell>
            <TableCell>{item?.applicant.createdAt?.split("T")[0]}</TableCell>
            <TableCell className="float-right cursor-pointer">
              <Popover>
                <PopoverTrigger>
                  <MoreHorizontal />
                </PopoverTrigger>
                <PopoverContent className="w-32">
                  {shortlistingStatus.map((status, index) => (
                    <div
                      key={index}
                      onClick={() => statusHandler(status, item?._id)}
                      className="flex w-fit items-center my-2 cursor-pointer"
                    >
                      <span>{status}</span>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApplicantsTable;
