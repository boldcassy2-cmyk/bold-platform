import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Adjust to your firebase config path
import { sendEmailVerification, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';

export default function VendorVerification({ user }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState('');
  const db = getFirestore();

  // 1. Send Email Verification
  const handleSendEmailVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setEmailSent(true);
      setMessage('Verification email sent! Check your inbox.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // 2. Setup reCAPTCHA and Send Phone OTP
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handleSendPhoneOtp = async (e) => {
    e.preventDefault();
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setMessage('OTP code sent to your phone!');
    } catch (error) {
      setMessage(`SMS error: ${error.message}`);
    }
  };

  // 3. Verify Phone OTP Code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Update Firestore user/vendor profile status
      await updateDoc(doc(db, 'users', user.uid), {
        phoneVerified: true,
        phoneNumber: phoneNumber
      });

      setMessage('Phone number successfully verified!');
    } catch (error) {
      setMessage('Invalid OTP code. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 my-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Vendor Identity Verification</h2>
      
      {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">{message}</div>}

      {/* Email Section */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-2">1. Email Address Verification</h3>
        <p className="text-sm text-gray-500 mb-3">{auth.currentUser?.email}</p>
        {auth.currentUser?.emailVerified ? (
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">Verified ✓</span>
        ) : (
          <button 
            onClick={handleSendEmailVerification}
            className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
          >
            {emailSent ? 'Resend Verification Email' : 'Send Verification Email'}
          </button>
        )}
      </div>

      {/* Phone Number OTP Section */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">2. Phone Number OTP Verification</h3>
        {!confirmationResult ? (
          <form onSubmit={handleSendPhoneOtp} className="space-y-3">
            <input 
              type="tel" 
              placeholder="+2348012345678" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
            <div id="recaptcha-container"></div>
            <button 
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
            >
              Send OTP Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
            <button 
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              Confirm OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}