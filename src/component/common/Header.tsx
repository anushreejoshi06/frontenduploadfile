// import axios from "axios";
// import { AlignJustify, LogOut } from "react-icons/fa"; // Using FontAwesome for icons
// import { useDispatch } from "react-redux";
// import { logoutUser } from "@/store/auth-slice";
import { FiLogOut } from "react-icons/fi";
import { LuAlignJustify } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function Header({ setOpen }: any) {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.clear();
    // navigate(0);
    navigate('/login')
    
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow border-b">
      <button
        onClick={() => setOpen(true)}
        // className="lg:hidden block text-gray-700 hover:text-gray-900"
        className=" text-gray-700 hover:text-gray-900"
      >
        <LuAlignJustify />

        <span className="sr-only">Toggle Menu</span>
      </button>
      <div className="flex-1 flex justify-end">
        <button
          onClick={logOut}
          className="flex items-center gap-2 bg-red-500 text-white rounded px-4 py-1"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
