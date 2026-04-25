import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/stores/store";

import { FiHome, FiList, FiLogOut } from "react-icons/fi";
import { logout } from "@/redux/slices/globalSlice";

function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.global.user);

  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Tasks", icon: <FiList />, path: "/tasks" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <aside
      className={`
        fixed md:static top-0 left-0 h-screen w-64
        bg-gray-900 text-white p-5 z-50
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* USER */}
      <div className="flex items-center gap-3 mb-6 bg-white/10 p-3 rounded-lg">
        <img
          src={
            user?.profileImage
              ? user.profileImage
              : "https://i.pravatar.cc/100"
          }
          className="w-10 h-10 rounded-full"
        />

        <div>
          <p className="text-sm font-semibold">
            {user?.email?.split("@")[0] || "User"}
          </p>
          <p className="text-xs text-gray-300">
            {user?.email || "user@mail.com"}
          </p>
        </div>
      </div>

      {/* MENU */}
      <nav className="space-y-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.name}
              onClick={() => handleNavigate(item.path)}
              className={`
                flex items-center gap-3 p-2 rounded-lg cursor-pointer
                transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/10 text-gray-300"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={() => {
          dispatch(logout());
          navigate("/login");
        }}
        className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-2 rounded-lg"
      >
        <FiLogOut />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;