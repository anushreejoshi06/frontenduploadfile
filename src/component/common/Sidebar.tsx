import {FaTimes} from "react-icons/fa";
import { LuFolderSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { MdDashboardCustomize } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";

const adminSidebarMenuItems = [
  { id: "dashboard", label: "Govt. Dashboard", path: "/home", icon: <MdDashboardCustomize /> },
  { id: "brand", label: "Trademark Management", path: "/main", icon: <AiOutlineInfoCircle /> },
  { id: "orders", label: "Search Word", path: "/search", icon: <LuFolderSearch /> },
];

function MenuItems({ setOpen }:any) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex flex-col gap-4">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            if (setOpen) setOpen(false); // Close sidebar on menu item click
          }}
          className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-200 rounded-md"
        >
          <span className="text-xl">{menuItem.icon}</span>
          <span className="font-medium">{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function Sidebar({ open, setOpen }:any) {
  const handleBackdropClick = (e:any) => {
    if (e.target.id === "backdrop") {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Sidebar with Backdrop */}
      {open && (
        <div
          id="backdrop"
          className="fixed inset-0 z-30 lg:hidden bg-black bg-opacity-50"
          onClick={handleBackdropClick} // Close on backdrop click
        >
          <aside className="fixed left-0 top-0 h-full w-64 bg-white p-6 shadow-lg z-40">
            <div className="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-700 hover:text-gray-900 mb-0"
              >
                <FaTimes size={16} />
              </button>
            </div>
            <img
              src="/fileUploadlogo-removebg.png"
              alt="Admin Dashboard"
              className="px-4 font-bold py-1"
              style={{ width: "200px", height: "auto" }}
            />
            <MenuItems setOpen={setOpen} />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`${
          // open ? "block" : "hidden lg:block"
          open ? "block" : "hidden "

        } fixed z-50 left-0 top-0 h-full w-64 flex-col bg-white border-r p-6`}
      >
        <div>
          <img
            src="/fileUploadlogo-removebg.png"
            alt="Admin Dashboard"
            className="px-4 font-bold py-1"
            style={{ width: "200px", height: "auto" }}
          />
        </div>
        <MenuItems setOpen={setOpen} />
      </aside>
    </>
  );
}

export default Sidebar;


