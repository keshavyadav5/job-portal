import React, { useEffect, useState } from 'react'
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Delete, Edit2, Loader2, MoreHorizontal, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useDeleteCompanyMutation } from '@/utils/api/companySlice'
import SessionExpire from '@/hooks/SessionExpire'
import { useSelector } from 'react-redux'

const CompaniesTable = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)
  const navigate = useNavigate()
  const [filterCompany, setFilterCompany] = useState(companies);

  const { searchCompanyByText } = useSelector(store => store.company);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true })
        if (res.data.success) {
          setCompanies(res.data.companies || [])
        } else {
          setError(new Error("Failed to load companies"))
        }
      } catch (err) {
        console.error('Error fetching companies:', err.response?.status, err.response?.data)
        if (err.response?.status === 401) {
          setSessionExpired(true)
        } else {
          setError(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  useEffect(() => {
    const filteredCompany = companies.length >= 0 && companies.filter((company) => {
      if (!searchCompanyByText) {
        return true
      };
      return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

    });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText])

  const handleDelete = (company) => {
    setCompanyToDelete(company)
    setOpen(true)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-500" />
        <p className="text-gray-500 mt-2">Loading companies...</p>
      </div>
    )
  }

  if (error && !sessionExpired) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error.message}</p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your recently registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany.map((company) => (
            <TableRow key={company._id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={company.logo} alt={`${company.name} logo`} />
                </Avatar>
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>
                {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell>{company.location || 'N/A'}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger aria-label="Company actions">
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2 bg-white shadow-lg rounded-xl border border-gray-100">
                    <div
                      onClick={() => navigate(`/admin/companies/${company._id}`)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg cursor-pointer transition-all duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </div>

                    <div
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg cursor-pointer transition-all duration-200"
                      onClick={() => handleDelete(company)}
                    >
                      <Delete className="w-4 h-4" />
                      <span>Delete</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Company Dialog */}
      <DeleteCompanyById
        open={open}
        setOpen={setOpen}
        companyId={companyToDelete?._id}
        companyName={companyToDelete?.name}
        onDeleted={() => {
          setCompanies(prev => prev.filter(c => c._id !== companyToDelete._id))
        }}
      />

      {/* Session Expired Dialog */}
      <SessionExpire open={sessionExpired} setOpen={setSessionExpired} />
    </div>
  )
}

export default CompaniesTable


// DELETE COMPANY COMPONENT
const DeleteCompanyById = ({ companyId, open, setOpen, companyName, onDeleted }) => {
  const [deleteCompany, { isLoading: loading }] = useDeleteCompanyMutation()

  const submitHandler = async () => {
    try {
      const res = await deleteCompany(companyId).unwrap()
      if (res?.success) {
        toast.success(`${companyName} deleted successfully`)
        onDeleted?.()
      } else {
        toast.error(res.message || "Failed to delete company")
      }
    } catch (error) {
      if (error?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error(error?.data?.message || "Something went wrong")
      }
    } finally {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
            Delete Company
          </DialogTitle>
          <p className="text-sm text-gray-500 text-center mt-2">
            Are you sure you want to delete{" "}
            <span className="font-medium text-red-600">{companyName}</span>? <br />
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
