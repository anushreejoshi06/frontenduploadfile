import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter a valid email.');
      return;
    }

    setIsLoading(true);
    setMessage(''); // Reset message
    
    try {
    //   const response = await axios.post('http://127.0.0.1:8000/forgot-password/', { email });
    const response = await axios.post(import.meta.env.VITE_REST_API_URL +'/forgot-password/', { email });
    
      console.log('response', response)
      if (response.status === 200) {
        setMessage('Check your email for reset instructions.');
        navigate('/reset-password')
      }
    } catch (error) {
      setMessage('Failed to send reset email.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      {/* <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'> */}
      {/* <div className='flex items-center justify-between '> */}
      <div className='flex items-center justify-between max-w-5xl  mx-auto border border-gray-200 rounded-md shadow-xl p-0  bg-blue-900'>

      <div className='w-[60%] hidden lg:block'>
          <img
            // src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            src="./uploadfileLogo.png"

            alt='Login Image'
            className='w-full h-auto object-cover rounded-l-md'
          />
        </div>
      <div className='w-full lg:w-[40%] px-6 bg-white py-28'>
        <h2 className='text-2xl font-semibold text-center mb-4'>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className='mt-4 mb-1'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 my-1'>
              Enter your email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Please enter your email'
              className='w-full px-3 py-3 border border-gray-300 rounded-md'
            />
          </div>

          {message && <p className='text-sm text-red-500'>{message}</p>}

          <button
            type='submit'
            className={`w-full my-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
