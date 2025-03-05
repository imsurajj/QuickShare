'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Logo from '@/components/Logo'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
  requirements: string[];
}

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    newsletter: false
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    message: '',
    color: 'gray',
    requirements: [],
  })

  const checkPasswordStrength = (password: string) => {
    let score = 0
    let message = ''
    let color = 'gray'
    const requirements: string[] = []

    // Check length
    if (password.length >= 8) {
      score++
      requirements.push('✓ 8+ characters')
    } else {
      requirements.push('✗ 8+ characters')
    }

    // Check uppercase
    if (password.match(/[A-Z]/)) {
      score++
      requirements.push('✓ Uppercase letter')
    } else {
      requirements.push('✗ Uppercase letter')
    }

    // Check lowercase
    if (password.match(/[a-z]/)) {
      score++
      requirements.push('✓ Lowercase letter')
    } else {
      requirements.push('✗ Lowercase letter')
    }

    // Check numbers
    if (password.match(/[0-9]/)) {
      score++
      requirements.push('✓ Number')
    } else {
      requirements.push('✗ Number')
    }

    // Check special characters
    if (password.match(/[^A-Za-z0-9]/)) {
      score++
      requirements.push('✓ Special character')
    } else {
      requirements.push('✗ Special character')
    }

    switch (score) {
      case 0:
      case 1:
        message = 'Very Weak'
        color = 'red'
        break
      case 2:
        message = 'Weak'
        color = 'red'
        break
      case 3:
        message = 'Medium'
        color = 'yellow'
        break
      case 4:
        message = 'Strong'
        color = 'green'
        break
      case 5:
        message = 'Very Strong'
        color = 'green'
        break
      default:
        message = ''
        color = 'gray'
    }

    setPasswordStrength({ score, message, color, requirements })
  }

  useEffect(() => {
    if (formData.password) {
      checkPasswordStrength(formData.password)
    }
  }, [formData.password])

  const validateForm = () => {
    let isValid = true
    const newErrors = { name: '', email: '', password: '', confirmPassword: '', agreeToTerms: '' }

    if (!formData.name) {
      newErrors.name = 'Name is required'
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms and Privacy Policy'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        // Sign up the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              newsletter: formData.newsletter,
            },
          },
        })

        if (signUpError) {
          throw signUpError
        }

        if (signUpData.user) {
          // Create a profile in your profiles table (if you have one)
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: signUpData.user.id,
                full_name: formData.name,
                email: formData.email,
                newsletter: formData.newsletter,
              },
            ])

          if (profileError) {
            console.error('Error creating profile:', profileError)
          }

          router.push('/verify-email') // Create this page to show email verification instructions
        }
      } catch (error: unknown) {
        setErrors(prev => ({
          ...prev,
          email: error instanceof Error ? error.message : 'An error occurred',
        }))
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

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
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-blue-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </motion.div>

          <motion.form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="rounded-md space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-600">Password strength:</div>
                      <div className={`text-sm font-medium text-${passwordStrength.color}-600`}>
                        {passwordStrength.message}
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.score <= 1 ? '#ef4444' : 
                                        passwordStrength.score === 2 ? '#ef4444' : 
                                        passwordStrength.score === 3 ? '#eab308' : 
                                        '#22c55e'
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {passwordStrength.requirements?.map((req, index) => (
                        <div
                          key={index}
                          className={`text-xs ${
                            req === '✓' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10`}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-indigo-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-indigo-500">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletter" className="font-medium text-gray-700">
                    Subscribe to our newsletter
                  </label>
                  <p className="text-gray-500">Get updates about new features and releases.</p>
                </div>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  )
} 