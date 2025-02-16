import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useForgotPasswordCodeMutation, useVerifyCodeAndResetPasswordMutation } from '../redux/features/users/user.api';
import { useNavigate } from 'react-router';

const ForgotPassword = () => {
  const [step, setStep] = useState(2); // 1: Send code, 2: Verify code and reset password
  const [email, setEmail] = useState('msionlinekingdom@gmail.com'); // Store email for step 2
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sendForgotPassCode, { isLoading: isSendingCode }] = useForgotPasswordCodeMutation();
  const [verifyCodeAndResetPassword, { isLoading: isResettingPassword }] = useVerifyCodeAndResetPasswordMutation();
  const navigate = useNavigate();

  // Step 1: Send code to email
  const onSubmitSendCode = async (data) => {
    const toastId = toast.loading("Sending password reset code...");
    try {
      const result = await sendForgotPassCode(data).unwrap();
      if (result?.success) {
        setEmail(data.email); // Save email for step 2
        setStep(2); // Move to step 2
        toast.success('Please check your email. A code is sent.', { id: toastId, duration: 3000 });
      } else {
        toast.error('Something went wrong.', { id: toastId, duration: 3000 });
      }
    } catch (err) {
      console.error('Code not sent', err);
      toast.error("Email not sent.", { id: toastId, duration: 3000 });
    }
  };

  // Step 2: Verify code and reset password
  const onSubmitResetPassword = async (data) => {
    console.log({ email, code:Number(data.code),password:data.password })
    const toastId = toast.loading("Resetting password...");
    try {
      const result = await verifyCodeAndResetPassword({ email, code:Number(data.code),password:data.password }).unwrap();
      if (result?.success) {
        toast.success('Password reset successfully!', { id: toastId, duration: 3000 });
        navigate("/"); // Redirect to login page
      } else {
        toast.error('Invalid code or something went wrong.', { id: toastId, duration: 3000 });
      }
    } catch (err) {
      console.error('Password reset failed', err);
      toast.error("Password reset failed.", { id: toastId, duration: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleSubmit(onSubmitSendCode)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSendingCode}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isSendingCode ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmitResetPassword)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input
                type="number"
                {...register("code", { required: "Code is required" })}
                className={`mt-1 block w-full px-3 py-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                {...register("password", { required: "New password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                className={`mt-1 block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isResettingPassword}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isResettingPassword ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;