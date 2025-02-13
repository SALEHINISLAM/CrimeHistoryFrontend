import React from 'react';
import ProfileUpdate from './UpdateProfile';
import VerifyCode from './VerifyCode';
import { useSendVerifyCodeMutation } from '../../redux/features/users/user.api';
import { toast } from 'sonner';

const UserProfile = ({ user }) => {
  console.log(user)
  const [sendCode, { isLoading }] = useSendVerifyCodeMutation();

  const handleVerifyButton = async () => {
    const toastId=toast.loading("Please wait...")
    try {
      // Send the verification code to the user's email
      const response = await sendCode().unwrap();

      if (response.success) {
        // Open the modal after the code is sent successfully
        const modal = document.getElementById("verifyCode");
        if (modal) {
          modal.showModal(); // Open the modal
        }
        toast.success("Verification code sent successfully.", { id: toastId, duration: 3000 })
      } else {
        console.error("Failed to send verification code:", response.message);
        alert("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (user && user?.role === "UnVerifiedUser") {
    return <div className="m-3"><button className='btn btn-error flex w-full' onClick={handleVerifyButton}>Verify Now</button>
      <dialog id="verifyCode" className="modal">
        <div className="modal-box max-h-[90vh]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-0 top-1 text-red-500 border border-black">✕</button>
          </form>
          <VerifyCode email={user?.email} />
        </div>
      </dialog>
    </div>
  }
  return (
    <div className="card w-full bg-base-100 shadow-xl mx-auto my-10">
      <figure className="px-10 pt-10">
        <img
          src={user?.profile_pic}
          alt={user?.name}
          className="rounded-full w-32 h-32 object-cover"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl font-bold">{user?.name}</h2>
        <h3>{user?.bio}</h3>
        <p className="text-gray-600">{user?.email}</p>
        <div className="badge badge-primary mt-2">{user?.role}</div>

        <div className="mt-4 space-y-2 text-left w-full">
          <p><span className="font-semibold">User ID:</span> {user?.user_id}</p>
          <p><span className="font-semibold">Phone:</span> {user?.phone_number}</p>
          <p><span className="font-semibold">Joined:</span> {new Date(user?.createdAt).toLocaleDateString()}</p>
          <p><span className="font-semibold">Last Updated:</span> {new Date(user?.updatedAt).toLocaleDateString()}</p>
          <p><span className="font-semibold">Contribution Score:</span> {user?.contribution_score}</p>
        </div>

        <div className="card-actions mt-6">
          {user?.is_banned ? (
            <div className="badge badge-error gap-2">Banned</div>
          ) : (
            <div className="badge badge-success gap-2">Active</div>
          )}
          {user?.needs_password_change && (
            <div className="badge badge-warning gap-2">Password Change Required</div>
          )}
        </div>
        <button className="btn w-full" onClick={() => document.getElementById('editProfile').showModal()}>Update Profile</button>
        <dialog id="editProfile" className="modal">
          <div className="modal-box max-h-[90vh]">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-0 top-1 text-red-500 border border-black">✕</button>
            </form>
            <ProfileUpdate userData={user} />
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default UserProfile;