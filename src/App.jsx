import React from 'react';
import { useForm } from 'react-hook-form';
import { verifyToken } from './utilis/verifyToken';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useLoginMutation } from './redux/features/auth/AuthApis';
import { setUser, useCurrentUser } from './redux/features/auth/AuthSlice';
import { Navigate } from 'react-router';

function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loggedInUser=useAppSelector(useCurrentUser)
  if (loggedInUser) {
    return <Navigate to={"/feed"}/>
  }
  console.log(loggedInUser)
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginUser, { isLoading, isError, error }] =useLoginMutation() ;

  const onSubmit =async (data) => {
    console.log(data);
    const toastId = toast.loading("Logging in...")
    try {
      const result = await loginUser(data).unwrap(); // Trigger the login mutation
      console.log('Login successful:', result);
      const user =verifyToken(result?.data?.accessToken)
      if (user) {
        dispatch(setUser({ user: user, token: result?.data?.accessToken }));
        navigate("/feed")
        toast.success('Login successful', { id: toastId, duration: 3000 });
      } else {
        toast.error('Token verification failed', { id: toastId, duration: 3000 });
      }
    } catch (err) {
      console.error('Login failed:', err);
      toast.error("Invalid credentials2", { id: toastId, duration: 3000 })
    }
  };

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse justify-between">
          <div className="text-center lg:text-left shrink-0">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Login to access the world of crime community!
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
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-neutral">Login</button>
                </div>
                <div className="text-center mt-4">
                  <Link to={"/forgot-password"} className="link link-hover">Forgot password?</Link>
                </div>
                <div className="text-center mt-4">
                  <p className="font-semibold">Do not have an account <Link to={"/register"} className='underline'> Register Now.</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;