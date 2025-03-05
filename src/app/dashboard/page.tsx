'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DashboardNavbar from '../components/DashboardNavbar';
import AnimatedBadge from '../components/AnimatedBadge';

const DashboardPage = () => {
  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-white pt-16 px-4">
        <div className="max-w-7xl mx-auto py-8">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedBadge text="Dashboard Preview" className="mt-6" />
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-lg p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow"
            >
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4"
              >
                Coming Soon
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-gray-600 text-lg md:text-xl mb-8"
              >
                We&apos;re working hard to bring you an amazing dashboard experience. Stay tuned for updates!                </motion.p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                {[
                  {
                    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                    title: "Analytics"
                  },
                  {
                    icon: "M13 10V3L4 14h7v7l9-11h-7z",
                    title: "Performance"
                  },
                  {
                    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                    title: "Users"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.4 + (index * 0.1),
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg p-6 w-full md:w-1/3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold">{item.title}</h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 text-gray-600"
            >
              © 2024 CyberShield. All rights reserved.
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage; 