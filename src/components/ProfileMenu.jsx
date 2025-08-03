import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import useAuthStore from "../utils/store/useAuthStore";

const ProfileMenu = ({ user, navigate, isOpen }) => {
    const { logout } = useAuthStore();
    const [show, setShow] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const closeMenu = e => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShow(false);
            }
        };
        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    return (
        <div
            ref={menuRef}
            className="mt-auto relative text-sm text-gray-800 rounded px-3 py-2 hover:bg-gray-200 cursor-pointer transition"
            onClick={() => setShow(!show)}
        >
            <div className="flex items-center gap-2">
                <Cog6ToothIcon className="w-6 h-6" />
                {isOpen && <span className="truncate">{user?.email}</span>}
            </div>

            {show && (
                <div className="absolute bottom-full mb-2 left-0 w-40 bg-white text-gray-800 rounded shadow-md z-50 transition">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Settings</button>
                    <button
                        onClick={() => logout(navigate)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
