import React from 'react'
import { useLogoutMutation } from '@/utils/api/userApiSlice'
import { setUser } from '@/redux/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const SessionExpire = ({ open, setOpen }) => {
  const [logout, { isLoading }] = useLogoutMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      dispatch(setUser(null))
      navigate('/login')
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(error?.data?.message || "Error occurred while logging out")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-red-600 text-center">
            Session Expired
          </DialogTitle>
          <p className="text-sm text-gray-600 text-center mt-2">
            Your session has expired. Please log in again to continue.
          </p>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setSessionExpired(false)
              navigate('/login')
            }}
            className="w-full sm:w-1/2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SessionExpire
