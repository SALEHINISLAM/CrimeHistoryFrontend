import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '../../redux/features/users/user.api';

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Changing password...");
    console.log(data)
    try {
      const result = await changePassword(data).unwrap();
      if (result?.success) {
        toast.success('Password changed successfully!', { id: toastId, duration: 3000 });
      } else {
        toast.error('Failed to change password.', { id: toastId, duration: 3000 });
      }
    } catch (err) {
      console.error('Password change failed', err);
      toast.error("Failed to change password.", { id: toastId, duration: 3000 });
    }
  };

  return (
    <div className="p-2 rounded-md flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Old Password</label>
            <input
              type="password"
              {...register("oldPassword", { required: "Old password is required" })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              {...register("confirmNewPassword", {
                required: "Please confirm your new password",
                validate: (value) => value === watch("newPassword") || "Passwords do not match",
              })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;