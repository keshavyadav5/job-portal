import React, { useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryyCarousel'
import LatestJobs from './LatestJob'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import TopNiches from './TopNiches'
import HowItWorks from './HowItWorks'
import Companies from '../admin/Companies'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <>
      {user?.role === 'recruiter' ? (
        <Companies />
      ) : (
        <div>
          <div className='min-h-screen flex flex-col items-center justify-center h-full w-full'>
            <Navbar />
            <HeroSection />
            <CategoryCarousel />
          </div>
          <LatestJobs />
          <TopNiches />
          <HowItWorks />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;
