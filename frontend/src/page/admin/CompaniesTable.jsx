import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Delete, Edit2, Loader2, MoreHorizontal, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useDeleteCompanyMutation, useGetAllCompanyQuery } from '@/utils/api/companySlice'

const CompaniesTable = () => {
  const { data, isLoading, isError, error } = useGetAllCompanyQuery();
  const [open, setOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const navigate = useNavigate();

  const companies = data?.companies || data || [];

  const handleDelete = (company) => {
    setCompanyToDelete(company);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-500" />
        <p className="text-gray-500 mt-2">Loading companies...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading companies: {error?.message || 'Something went wrong'}</p>
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No companies registered yet.</p>
      </div>
    );
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
          {companies.map((company) => (
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

      <DeleteCompanyById
        open={open}
        setOpen={setOpen}
        companyId={companyToDelete?._id}
        companyName={companyToDelete?.name}
      />
    </div>
  );
};

export default CompaniesTable;

const DeleteCompanyById = ({ companyId, open, setOpen, companyName }) => {
  const [deleteCompany, { isLoading: loading }] = useDeleteCompanyMutation();
  
  const submitHandler = async () => {
    try {
      const res = await deleteCompany(companyId).unwrap();
      if (res?.success) {
        toast.success(`${companyName} deleted successfully`);
      } else {
        toast.error(res.message || "Failed to delete company");
      }
    } catch (error) {
      toast.error(error.data?.message || "Something went wrong");
    } finally {
      setOpen(false);
    }
  };

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
  );
};