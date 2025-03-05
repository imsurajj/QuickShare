'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Logo from '@/components/Logo'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="absolute top-4 left-4">
          <Link
            href="/"
            className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                We&apos;ve sent you an email with a verification link. Please click the link to verify your account.
              </p>
              <div className="mt-6 space-y-4">
                <p className="text-gray-600">
                  Already verified?{' '}
                  <Link href="/signin" className="text-blue-600 hover:text-indigo-500">
                    Sign in to your account
                  </Link>
                </p>
                <p className="text-gray-600">
                  Didn&apos;t receive the email?{' '}
                  <Link href="/signup" className="text-blue-600 hover:text-indigo-500">
                    Try signing up again
                  </Link>
                </p>
                <div className="pt-4">
                  <Link
                    href="/signin"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 