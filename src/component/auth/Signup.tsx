import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error message when the user starts typing
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = async(e:any) => {
    e.preventDefault();

    // Validate form fields
    let newErrors = { username: '', email: '', password: '' };
    if (!formData.username) {
      newErrors.username = 'username is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    // If there are errors, update the state and return early
    if (newErrors.username || newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(import.meta.env.VITE_REST_API_URL +'/signup',formData)
      console.log('response', response)
      if(response.status === 200){
        toast.success(response.data.msg)
        navigate('/login')
      }
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) && error.response
          ? error.response.data.detail
          : "An unexpected error occurred."
      );
    }
   
    
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='flex items-center justify-between max-w-5xl  border border-gray-200 rounded-md shadow-xl m-4  bg-blue-900'>
      {/* <div className='flex items-center justify-between '> */}

        {/* Image Section */}
        <div className='w-[60%] hidden md:block'>
          <img
            // src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            src="./uploadfileLogo.png"

            alt='Signup Image'
            className='w-full p-4 h-auto object-cover rounded-l-md '

          />
        </div>

        {/* Signup Form Section */}
        <form onSubmit={handleSubmit} className='w-full md:w-[40%] bg-white p-8'>
          <h1 className='font-bold text-2xl mb-6 text-center'>Sign Up</h1>

          {/* Name Field */}
          <div className='my-4 '>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 my-1'>
              Name
            </label>
            <input
              id='username'
              name='username'
              type='text'
              value={formData.username}
              onChange={handleChange}
              placeholder='Please enter your name'
              className={`w-full px-3 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.username && <p className='text-red-500 text-sm'>{errors.username}</p>}
          </div>

          {/* Email Field */}
          <div className='my-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 my-1'>
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Please enter your email'
              className={`w-full px-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className='my-4'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 my-1'>
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Please enter your password'
              className={`w-full px-3 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
          </div>

          {/* Terms and Conditions */}
          {/* <div className='flex items-center justify-between my-4'>
            <div className='flex items-center'>
              <input
                id='terms'
                name='terms'
                type='checkbox'
                required
                className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              />
              <label htmlFor='terms' className='ml-2 block text-sm text-gray-900'>
                I agree to the terms and conditions
              </label>
            </div>
          </div> */}

          {/* Sign Up Button */}
          <button
            type='submit'
            className='w-full my-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Sign Up
          </button>

          {/* Login Link */}
          <span className='text-sm block text-center mt-4'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 font-semibold'>
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;


// ---------------------------------------------------------------------------
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//     // You can handle form submission here (e.g., send data to API)
//   };

//   return (
//     <div className='flex items-center justify-center min-h-screen bg-gray-100'>
//       <div className='w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg'>
//         <h2 className='text-3xl font-extrabold text-center text-gray-900'>Sign up for an account</h2>
//         <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
//           {/* <div className='-space-y-px rounded-md shadow-sm'> */}
//           <div className='rounded-md shadow-sm'>

//             {/* Name Field */}
//             <div>
//               <label htmlFor='name' className='sr-only'>
//                 Name
//               </label>
//               <input
//                 id='name'
//                 name='name'
//                 type='text'
//                 autoComplete='name'
//                 required
//                 className='relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
//                 placeholder='Name'
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>
//             {/* Email Field */}
//             <div className='mt-4'>
//               <label htmlFor='email' className='sr-only'>
//                 Email address
//               </label>
//               <input
//                 id='email'
//                 name='email'
//                 type='email'
//                 autoComplete='email'
//                 required
//                 className='relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
//                 placeholder='Email address'
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             {/* Password Field */}
//             <div className='mt-4'>
//               <label htmlFor='password' className='sr-only'>
//                 Password
//               </label>
//               <input
//                 id='password'
//                 name='password'
//                 type='password'
//                 autoComplete='current-password'
//                 required
//                 className='relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
//                 placeholder='Password'
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className='flex items-center justify-between'>
//             <div className='flex items-center'>
//               <input
//                 id='terms'
//                 name='terms'
//                 type='checkbox'
//                 required
//                 className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
//               />
//               <label htmlFor='terms' className='ml-2 block text-sm text-gray-900'>
//                 I agree to the terms and conditions
//               </label>
//             </div>
//           </div>

//           <div>
//             <button
//               type='submit'
//               className='relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
//             >
//               Sign Up
//             </button>
//           </div>
//           <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;
