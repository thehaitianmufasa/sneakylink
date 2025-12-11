'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function OnboardingPage() {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1)
  const [formData, setFormData] = useState({
    companyName: '',
    employeeCount: '',
    workTypes: [] as string[],
    // Page 2 fields (to be added)
  })
  const [errors, setErrors] = useState({
    companyName: '',
    employeeCount: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  // Auto-save to Supabase every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.companyName.trim()) {
        saveToSupabase()
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [formData])

  const saveToSupabase = async () => {
    try {
      setIsSaving(true)
      // TODO: Implement actual save to Supabase
      // For now, just simulate save
      console.log('Auto-saving to Supabase:', formData)
    } catch (error) {
      console.error('Error saving to Supabase:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const validateCompanyName = () => {
    if (!formData.companyName.trim()) {
      setErrors(prev => ({ ...prev, companyName: 'Company name is required' }))
      return false
    }
    setErrors(prev => ({ ...prev, companyName: '' }))
    return true
  }

  const handleNext = () => {
    if (currentPage === 1) {
      // Validate before proceeding
      if (!validateCompanyName()) {
        return
      }
      setCurrentPage(2)
    }
  }

  const handleBack = () => {
    if (currentPage === 2) {
      setCurrentPage(1)
    }
  }

  const handleWorkTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      workTypes: prev.workTypes.includes(type)
        ? prev.workTypes.filter(t => t !== type)
        : [...prev.workTypes, type]
    }))
  }

  return (
    <div className="min-h-screen bg-light-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-neutral-slate">
              Step {currentPage} of 2
            </span>
            <span className="text-sm text-neutral-slate">{currentPage === 1 ? '50%' : '100%'}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-success-green transition-all duration-300"
              style={{ width: currentPage === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Page 1: Company Information */}
          {currentPage === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-slate mb-2">
                  Welcome to Sneakylink
                </h1>
                <p className="text-neutral-slate">
                  Let's get your company set up for vendor compliance preparation.
                </p>
              </div>

              {/* Company Name Input */}
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-bold text-neutral-slate mb-2"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => {
                    setFormData({ ...formData, companyName: e.target.value })
                    // Clear error when user starts typing
                    if (errors.companyName) {
                      setErrors({ ...errors, companyName: '' })
                    }
                  }}
                  onBlur={validateCompanyName}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                    errors.companyName
                      ? 'border-danger-red focus:ring-danger-red'
                      : 'border-gray-300 focus:ring-trust-blue'
                  }`}
                  placeholder="Enter your company name"
                />
                {errors.companyName && (
                  <p className="mt-2 text-sm text-danger-red font-medium">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Employee Count Input */}
              <div>
                <label
                  htmlFor="employeeCount"
                  className="block text-sm font-bold text-neutral-slate mb-2"
                >
                  Number of Employees
                </label>
                <input
                  id="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust-blue focus:border-transparent transition-all"
                  placeholder="Enter number of employees"
                  min="1"
                />
              </div>

              {/* Work Types Checkboxes */}
              <div>
                <label className="block text-sm font-bold text-neutral-slate mb-3">
                  Types of Work Performed
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'electrical', label: 'Electrical Work' },
                    { id: 'heights', label: 'Working at Heights' },
                    { id: 'loto', label: 'Lockout/Tagout (LOTO)' },
                    { id: 'equipment', label: 'Heavy Equipment Operation' }
                  ].map((workType) => (
                    <label
                      key={workType.id}
                      className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-trust-blue cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.workTypes.includes(workType.id)}
                        onChange={() => handleWorkTypeToggle(workType.id)}
                        className="w-5 h-5 text-trust-blue border-gray-300 rounded focus:ring-2 focus:ring-trust-blue"
                      />
                      <span className="ml-3 text-neutral-slate font-medium">
                        {workType.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-trust-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Page 2: Additional Information (Placeholder) */}
          {currentPage === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-slate mb-2">
                  Almost There!
                </h1>
                <p className="text-neutral-slate">
                  Page 2 content will be added in the next feature.
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBack}
                  className="px-8 py-3 bg-gray-200 text-neutral-slate font-bold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-success-green text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-md"
                >
                  Complete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
