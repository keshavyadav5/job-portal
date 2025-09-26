import React from 'react'
import { useSelector } from 'react-redux';
import LatestJobCards from './LatestJobCards';


const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job);
  return (
    <div className='mx-3xl md:max-w-4xl mx-4 md:mx-8 lg:mx-auto my-20'>
      <h1 className='text-2xl md:text-4xl font-bold'><span className='text-[#6A38C2]'>Latest & Top </span> Job Openings</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2  gap-4 my-5'>
        {
          allJobs.length <= 0 ? <span>No Job Available</span> : allJobs?.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
        }
      </div>
    </div>
  )
}

export default LatestJobs