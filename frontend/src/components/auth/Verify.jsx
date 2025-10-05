import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Verify = () => {
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          `http://localhost:3000/api/v1/user/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.data.success) {
          setStatus("Email verified successfully");
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setStatus("Invalid or Expired Token");
        }
      } catch (error) {
        console.log(error);
        setStatus("Verification Failed. Please try again");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("Invalid Link");
    }
  }, [token, navigate]);

  return (
    <div className='relative w-full h-[760px] overflow-hidden'>
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-white p-6 rounded-xl shadow-md text-center w-[90%] max-w-md'>
          <h2 className='text-xl font-semibold text-gray-800'>{status}</h2>
        </div>
      </div>
    </div>
  );
};

export default Verify;
