import React from 'react';

const UserProfile = ({ user }) => {
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
      </div>
    </div>
  );
};

export default UserProfile;