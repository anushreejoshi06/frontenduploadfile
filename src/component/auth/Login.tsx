import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    

    // Validate form fields
    let newErrors = { email: '', password: '' };
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    // If there are errors, update the state and return early
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }
   // Set loading to true when form is submitted
   setIsLoading(true);
 
    try {
      const response = await axios.post(import.meta.env.VITE_REST_API_URL +"/login",formData)
      if(response.status === 200){
        toast.success("Login Successfully")
        window.localStorage.setItem("token",response.data.access_token)
        // window.localStorage.setItem("loggedIn",true)
        // window.localStorage.setItem("loggedIn", JSON.stringify(true));
        navigate('/home')
      }
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) && error.response
          ? error.response.data.detail
          : "An unexpected error occurred."
      );
    } finally {
      // Set loading to false after the API call completes
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center '>
           <div className='flex items-center justify-between max-w-5xl  border border-gray-200 rounded-md shadow-xl m-4  bg-blue-900'>

      {/* <div className='flex items-center justify-between '> */}

        {/* Image Section */}
        <div className='w-[60%] hidden md:block'>
          <img
            // src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            src="./uploadfileLogo.png"


            alt='Login Image'
            className='w-full h-auto object-cover rounded-l-md'
          />
        </div>

        {/* Login Form Section */}
        <form onSubmit={handleSubmit} className='w-full md:w-[40%] bg-white p-8'>
          <h1 className='font-bold text-2xl mb-6 text-center'>Login</h1>

          {/* Email Field */}
          <div className='my-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 my-1'>
              Email
            </label>
            <input
              type='email'
              name='email'
              id='email'
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
              type='password'
              name='password'
              id='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Please enter your password'
              className={`w-full px-3 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
          </div>

          {/* Remember Me */}
          {/* <div className='flex items-center justify-end my-2'>
            <Link to='/forgot-password' className='font-medium text-indigo-600 hover:text-indigo-500'>
              Forgot your password?
            </Link>
          </div> */}

          {/* <button
            type='submit'
            className='w-full my-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Login
          </button> */}
          {/* Submit Button with Loader */}
          <button
            type='submit'
            className={`w-full my-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Login'
            )}
          </button>


          {/* Signup Link */}
          <span className='text-sm block text-center mt-4'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-blue-600 font-semibold'>
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;


// -------------------------------------------------------
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({
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
//     // Handle form submission (e.g., send data to API)
//   };

//   return (
//     <div className='flex items-center justify-center min-h-screen bg-gray-100'>
//       <div className='w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg'>
//         <h2 className='text-3xl font-extrabold text-center text-gray-900'>Log in to your account</h2>
//         <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
//           <div className='rounded-md shadow-sm'>
//             {/* Email Field */}
//             <div>
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
//                 id='remember_me'
//                 name='remember_me'
//                 type='checkbox'
//                 className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
//               />
//               <label htmlFor='remember_me' className='ml-2 block text-sm text-gray-900'>
//                 Remember me
//               </label>
//             </div>

//             <div className='text-sm'>
//               <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500'>
//                 Forgot your password?
//               </a>
//             </div>
//           </div>

//           <div>
//             <button
//               type='submit'
//               className='relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
//             >
//               Log in
//             </button>
//           </div>
//           <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
