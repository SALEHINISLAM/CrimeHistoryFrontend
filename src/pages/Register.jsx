import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useRegisterMutation } from '../redux/features/auth/AuthApis';
import { useAppDispatch } from '../redux/hooks';

function Register() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [registerUser, { isLoading, isError, error }] = useRegisterMutation();

  const onSubmit = async (data) => {
    console.log(data);
    const toastId = toast.loading("Registering...");
    try {
      const result = await registerUser(data).unwrap(); // Trigger the register mutation
      console.log('Registration successful:', result);
      const suc = result?.success;
      if (suc) {
        navigate("/");
        toast.success('Registration successful', { id: toastId, duration: 3000 });
      } else {
        toast.error('Token verification failed', { id: toastId, duration: 3000 });
      }
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error("Registration failed", { id: toastId, duration: 3000 });
    }
  };

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row justify-between">
          <div className="text-center lg:text-left shrink-0">
            <h1 className="text-5xl font-bold">Register now!</h1>
            <p className="py-6">
              Register to access the world of crime community!
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <span className="text-error">{errors.email.message}</span>}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered"
                    {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && <span className="text-error">{errors.password.message}</span>}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="input input-bordered"
                    {...register('phone_number', { required: 'Phone number is required' })}
                  />
                  {errors.phone_number && <span className="text-error">{errors.phone_number.message}</span>}
                </div>
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-neutral">Register</button>
                </div>
                <div className="text-center mt-4">
                  <a className="link link-hover">Already have an account? Login</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;