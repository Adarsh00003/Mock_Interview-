import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FaUserTie, FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const options = [
    {
      id: 1,
      title: "HR Mode",
      description: "Conduct interviews and evaluate candidates",
      icon: FaUserTie,
      path: "/hr-dashboard",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: 2,
      title: "Candidate Mode",
      description: "Give interviews and get evaluated",
      icon: FaUser,
      path: "/candidate-dashboard",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <div className="flex-1 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Choose Your Role
            </h1>
            <p className="text-gray-500 text-lg">
              Select how you want to participate in the interview
            </p>
          </motion.div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {options.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => navigate(option.path)}
                  className={`cursor-pointer group`}
                >
                  <div
                    className={`h-full ${option.bgColor} ${option.borderColor} border-2 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:scale-105`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="text-white text-2xl" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {option.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                      {option.description}
                    </p>

                    {/* Button */}
                    <button
                      className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r ${option.color} hover:opacity-90 transition-opacity duration-300`}
                    >
                      Enter as {option.title.split(" ")[0]}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              How it works
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">HR Mode</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>✓ Schedule and conduct interviews</li>
                  <li>✓ View candidate profiles</li>
                  <li>✓ Rate and evaluate performance</li>
                  <li>✓ Access interview history</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  Candidate Mode
                </h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>✓ Join scheduled interviews</li>
                  <li>✓ Answer interview questions</li>
                  <li>✓ Get real-time evaluation</li>
                  <li>✓ Download performance reports</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
