import { useState } from "react";
import Sidebar from "../../common/Sidebar";
import Header from "../../common/Header";

const Layout = ({ children }:any) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar open={openSidebar} setOpen={setOpenSidebar} />
      {/* Main Content */}
      <div className={`flex flex-1 flex-col overflow-x-auto ${openSidebar ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <Header setOpen={() => setOpenSidebar((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:px-6 md:py-3">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

// -------------------------------------------------------------
// import { useState } from "react";
// import Sidebar from "../../common/Sidebar";
// import Header from "../../common/Header";
// const Layout = ({ children }: any) => {
//   const [openSidebar, setOpenSidebar] = useState(false);
 
//   return (
//     <div className="flex w-full min-h-screen">
//         <Sidebar open={openSidebar} setOpen={setOpenSidebar} />
//       <div className="flex flex-1 flex-col lg:ml-64 overflow-x-auto">
//       {/* <AdminHeader setOpen={setOpenSidebar} /> */}
//       <Header setOpen={setOpenSidebar} />
//         {/* main content  */}
//         <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 ">
//           <div className="">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

// -----------------------------------------------------------------------------------------
// import Sidebar from "../../common/Sidebar";
// import { RiLogoutCircleLine } from "react-icons/ri";
// import { useNavigate } from "react-router-dom";

// const Layout = ({ children }: any) => {
//   const navigate = useNavigate();
//   const logOut = () => {
//     localStorage.clear();
//     navigate(0);
//   };
//   return (
//     <div className="bg-gray-100">
//       <div className="bg-white shadow-lg py-2 flex justify-end">
//         <button
//           className="bg-white  font-bold py-1 px-4 rounded mx-2 flex items-center gap-1 "
//           onClick={logOut}
//         >
//           <RiLogoutCircleLine className="xl:text-2xl lg:text-xl " />
//           Logout
//         </button>
//         <img
//           alt=""
//           src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//           className="inline-block h-10 w-10 rounded-full ring-2 ring-white mx-4"
//         />
//       </div>
//       <div className="flex h-screen">
//         <div className="w-[20%] h-full  ">
//           <Sidebar />
//         </div>

//         {/* <div className=" w-[80%]  p-6 ">
//         <FileUpload />
//       </div> */}
//         {/* main content  */}
//         <main className="w-[80%]  p-6 ">
//           <div className="">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
// export default Home;
// env\Scripts\activate
// cd backend
// uvicorn main:app --reload
