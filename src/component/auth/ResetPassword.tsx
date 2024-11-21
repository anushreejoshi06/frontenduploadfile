import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (otp.length !== 6) {
      setMessage('OTP must be a 6-digit number.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      setMessage('Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setMessage(''); // Reset message

    try {
      const response = await axios.post(import.meta.env.VITE_REST_API_URL +'/reset-password/', {
        otp,
        new_password: newPassword,
      });
      console.log('response', response);

      if (response.status === 200) {
        setMessage('Password reset successful.');
        // Redirect to login page after successful reset
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Navigate to login page after 3 seconds
      }
    } catch (error: any) {
      // Handle error responses
      if (error.response && error.response.status === 400) {
        setMessage('Invalid OTP or request.');
      } else {
        setMessage('Failed to reset password. Please try again.');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      {/* <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'> */}
      <div className='flex items-center justify-between '>
      <div className='w-[60%] hidden lg:block'>
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt='Login Image'
            className='w-full h-auto object-cover rounded-l-md'
          />
        </div>
      <div className='w-full lg:w-[40%] p-6'>
        <h2 className='text-2xl font-semibold text-center mb-4'>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          {/* OTP input */}
          <div className='my-4'>
            <label htmlFor='otp' className='block text-sm font-medium text-gray-700 my-1'>
              Enter 6-digit OTP
            </label>
            <input
              type='text'
              id='otp'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder='Enter OTP'
              className='w-full px-3 py-3 border border-gray-300 rounded-md'
              maxLength={6}
              required
            />
          </div>

          {/* New password input */}
          <div className='my-4'>
            <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700 my-1'>
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter new password'
              className='w-full px-3 py-3 border border-gray-300 rounded-md'
              required
            />
          </div>

          {/* Confirm password input */}
          <div className='my-4'>
            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 my-1'>
              Confirm New Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm new password'
              className='w-full px-3 py-3 border border-gray-300 rounded-md'
              required
            />
          </div>

          {/* Message display */}
          {message && <p className={`text-sm ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}

          {/* Submit button */}
          <button
            type='submit'
            className={`w-full my-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
