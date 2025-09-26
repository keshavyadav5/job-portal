import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

// filter card mobile view 
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet"

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
  },
]

const FilterCard = () => {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState('')
  const dispatch = useDispatch()

  const changeHandler = (value) => {
    setSelectedValue(value)
  }

  useEffect(() => {
    if (selectedValue) {
      dispatch(setSearchedQuery(selectedValue))
    }
  }, [selectedValue, dispatch])

  // 🔥 Extracted common filter UI
  const renderFilters = () => (
    <RadioGroup value={selectedValue} onValueChange={changeHandler}>
      {filterData.map((data, index) => (
        <div key={index} className="my-3">
          <h1 className="font-bold text-lg">{data.filterType}</h1>
          {data.array.map((item, idx) => {
            const itemId = `id${index}-${idx}`
            return (
              <div key={itemId} className="flex items-center space-x-2 my-2">
                <RadioGroupItem value={item} id={itemId} />
                <Label htmlFor={itemId}>{item}</Label>
              </div>
            )
          })}
        </div>
      ))}
    </RadioGroup>
  )

  return (
    <div>
      {/* Desktop view */}
      <div className="w-full bg-white p-4 rounded-md hidden md:block">
        <h1 className="font-bold text-xl mb-2">Filter Jobs</h1>
        <hr className="mb-3" />
        {renderFilters()}
      </div>

      {/* Mobile button */}
      <Button
        className="text-lg w-[200px] bg-gray-400 hover:bg-slate-500 font-medium flex items-center gap-2 md:hidden"
        onClick={() => setOpen(true)}
      >
        Filter Jobs <ArrowRight size={20} />
      </Button>

      {/* Mobile sheet */}
      <FilterCardMobileView open={open} setOpen={setOpen}>
        {renderFilters()}
      </FilterCardMobileView>
    </div>
  )
}

export default FilterCard



// Mobile filter sheet
const FilterCardMobileView = ({ open, setOpen, children }) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[250px]">
        <SheetHeader>
          <h1 className="font-bold text-2xl">Filter Jobs</h1>
          <hr className="mt-2" />
        </SheetHeader>

        <div className="mx-4 -mt-5">{children}</div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="w-full mt-6">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
