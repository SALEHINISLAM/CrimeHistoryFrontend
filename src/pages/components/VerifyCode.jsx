import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useVerifyCodeMutation } from "../../redux/features/users/user.api";
import { useNavigate } from "react-router";

const VerifyCode = ({ email }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate()
    const [verifyCode, { isLoading }] = useVerifyCodeMutation();

    const onSubmit = async (data) => {
        try {
            const response = await verifyCode({ code: Number(data.code) }).unwrap();
            console.log(response)
            if (response.success) {
                navigate("/feed")
                toast.success("Verification successful!", { duration: 5000 });
            } else {
                toast.error("Invalid verification code", { duration: 3000 });
            }
        } catch (error) {
            console.error("Error verifying code:", error);
            toast.error("Something went wrong", { duration: 3000 });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Verify Code</h2>
            <p className="text-center mb-4">
                A 4-digit verification code has been sent to <strong>{email}</strong>.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Code Input Field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Verification Code</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter 4-digit code"
                        className={`input input-bordered ${errors.code ? "input-error" : ""
                            }`}
                        {...register("code", {
                            required: "Code is required",
                            pattern: {
                                value: /^\d{4}$/,
                                message: "Code must be a 4-digit number",
                            },
                        })}
                    />
                    {errors.code && (
                        <span className="text-error text-sm mt-1">
                            {errors.code.message}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <div className="form-control mt-6">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VerifyCode;