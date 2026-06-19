'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type Step = 'phone' | 'otp'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const notAdmin = params.get('error') === 'not_admin'
  const formatted = phone.length === 10 ? `+91${phone}` : ''

  async function sendOtp() {
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
    setLoading(false)
    if (error) return setError(error.message)
    setStep('otp')
  }

  async function verifyOtp() {
    setError(''); setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formatted, token: otp, type: 'sms',
    })
    setLoading(false)
    if (error) return setError(error.message)
    // Middleware will handle role check and redirect
    if (data.user?.phone !== process.env.ADMIN_PHONE) {
      await supabase.auth.signOut()
      return setError('This number is not registered as admin.')
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm">
        
      <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Login</h1>

        {notAdmin && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            That number doesn&apos;t have admin access.
          </p>
        )}

        {step === 'phone' && (
          <>
            <p className="text-sm text-gray-500 mb-4">Enter your registered admin number</p>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-3">
              <span className="px-3 bg-gray-50 border-r border-gray-300 text-sm text-gray-500 flex items-center">
                +91
              </span>
              <input
                type="tel" inputMode="numeric" maxLength={10}
                placeholder="10-digit number"
                className="flex-1 px-3 py-2.5 text-sm outline-none text-black"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <button
              onClick={sendOtp}
              disabled={loading || phone.length !== 10}
              className="w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40"
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <p className="text-sm text-gray-500 mb-4">Code sent to +91 {phone}</p>
            <input
              type="tel" inputMode="numeric" maxLength={6}
              placeholder="6-digit OTP"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-lg font-semibold tracking-widest text-center outline-none mb-3 focus:border-gray-900 text-black"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40 mb-2"
            >
              {loading ? 'Verifying…' : 'Verify'}
            </button>
            <button
              onClick={() => { setStep('phone'); setOtp(''); setError('') }}
              className="text-xs text-gray-400 hover:text-gray-700"
            >
              ← Change number
            </button>
          </>
        )}
      </div>
    </div>
  )
}