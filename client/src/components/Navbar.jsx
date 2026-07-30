import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { MdOutlineVideoCall } from "react-icons/md";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../config";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

function Navbar() {
  const { userData } = useSelector((state) => state.user);

  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });

      dispatch(setUserData(null));

      setShowCreditPopup(false);
      setShowUserPopup(false);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-[#f3f3f3] flex justify-center px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-7xl bg-white rounded-3xl shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center"
        >
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="bg-black text-white p-2 rounded-lg">
              <BsRobot size={18} />
            </div>

            <h1 className="font-semibold hidden md:block text-lg">
              InterviewIQ.AI
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 text-[15px] font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-black" : "text-gray-500 hover:text-black"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/"
              className="text-gray-500 hover:text-black"
            >
              AI Mock Interview
            </NavLink>

            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 text-gray-500 hover:text-black"
            >
              <MdOutlineVideoCall size={18} />
              Live Interview
            </NavLink>

            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                isActive ? "text-black" : "text-gray-500 hover:text-black"
              }
            >
              Pricing
            </NavLink>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-5 relative">
            {/* Credits */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }

                  setShowCreditPopup(!showCreditPopup);
                  setShowUserPopup(false);
                }}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
              >
                <BsCoin size={18} />
                <span>{userData?.credits || 0}</span>
              </button>

              {showCreditPopup && (
                <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl border rounded-xl p-5 z-50">
                  <p className="text-sm text-gray-600 mb-4">
                    Need more credits?
                  </p>

                  <button
                    onClick={() => {
                      navigate("/pricing");
                      setShowCreditPopup(false);
                    }}
                    className="w-full bg-black text-white py-2 rounded-lg"
                  >
                    Buy Credits
                  </button>
                </div>
              )}
            </div>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }

                  setShowUserPopup(!showUserPopup);
                  setShowCreditPopup(false);
                }}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold"
              >
                {userData ? (
                  userData.name.charAt(0).toUpperCase()
                ) : (
                  <FaUserAstronaut size={16} />
                )}
              </button>

              {showUserPopup && (
                <div className="absolute right-0 mt-3 w-56 bg-white border rounded-xl shadow-xl p-4 z-50">
                  <p className="font-semibold text-blue-600">
                    {userData?.name}
                  </p>

                  <p className="text-xs text-gray-500 mb-3">
                    {userData?.email}
                  </p>

                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setShowUserPopup(false);
                    }}
                    className="w-full text-left py-2 text-sm hover:text-black text-gray-600"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      navigate("/history");
                      setShowUserPopup(false);
                    }}
                    className="w-full text-left py-2 text-sm hover:text-black text-gray-600"
                  >
                    Interview History
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-sm flex items-center gap-2 text-red-500"
                  >
                    <HiOutlineLogout size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;