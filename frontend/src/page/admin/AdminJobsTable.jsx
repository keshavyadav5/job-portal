import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
  const [open, setOpen] = useState(false)
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const [jobToDelete, setJobToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText])

  const handleDelete = (job) => {
    setJobToDelete(job)
    setOpen(true)
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Niche</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job?.company?.name}</TableCell>
              <TableCell>{job?.jobType}</TableCell>
              <TableCell>{job?.title}</TableCell>
              <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
              <TableCell>{job?.location}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                  <PopoverContent className="w-40 p-1 bg-white rounded-lg shadow-md border border-gray-200">
                    <div
                      onClick={() => navigate(`/admin/job/update/${job._id}`)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md cursor-pointer transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </div>

                    <div
                      onClick={() => handleDelete(job)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-md cursor-pointer transition-colors duration-200 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </div>

                    <div
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-purple-600 rounded-md cursor-pointer transition-colors duration-200 mt-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Applicants</span>
                    </div>
                  </PopoverContent>

                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Dialog */}
      <DeleteJob
        jobId={jobToDelete?._id}
        open={open}
        setOpen={setOpen}
        title={jobToDelete?.title}
        onDeleted={() => {
          setFilterJobs(prev => prev.filter(c => c._id !== jobToDelete._id))
        }}
      />
    </div>
  )
}

export default AdminJobsTable


const DeleteJob = ({ jobId, open, setOpen, title, onDeleted }) => {
  const [loading, setLoading] = useState(false)

  const submitHandler = async () => {
    try {
      setLoading(true)
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true,
      });
      if (res?.data?.success) {
        toast.success(`${title} deleted successfully`)
        onDeleted?.()
      } else {
        toast.error(res.data?.message || "Failed to delete job")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
            Delete Job
          </DialogTitle>
          <p className="text-sm text-gray-500 text-center mt-2">
            Are you sure you want to delete{" "}
            <span className="font-medium text-red-600">{title}</span>? <br />
            This action cannot be undone.
          </p>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-1/2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancel
          </Button>

          <Button
            onClick={submitHandler}
            disabled={loading}
            className="w-full sm:w-1/2 bg-red-600 hover:bg-red-700 text-white transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
