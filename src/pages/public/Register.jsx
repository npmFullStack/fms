import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../config/axios";
import { useNavigate, Link } from "react-router-dom";
import { registerSchema } from "../../schemas/authSchema";
import registerImage from "../../assets/images/register.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast"; // <-- Add this import

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting } // Added isSubmitting
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    });

    const onSubmit = async data => {
        try {
            await api.post("/auth/register", data);

            // Show success toast
            toast.success("Registration successful!");

            // Wait a moment for toast to show before navigating
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Registration failed. Please try again.";

            // Show error toast
            toast.error(errorMessage);
        }
    };

    const password = watch("password");

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center px-4 font-[Poppins]">
            {/* ✅ Fixed Background Grid */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

            {/* Main Container */}
            <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Image Section */}
                <div className="hidden md:block md:w-1/2">
                    <img
                        src={registerImage}
                        alt="Register"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="mb-8 text-center">
                        <h1 className="page-title">Create an account</h1>
                        <p className="page-subtitle">
                            Join us today — it's free!
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Name Fields - First and Last Name in one row */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label
                                    htmlFor="firstName"
                                    className="input-label-modern"
                                >
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    {...register("firstName")}
                                    placeholder="First name"
                                    className={`input-field-modern ${
                                        errors.firstName ? "input-error" : ""
                                    }`}
                                />
                                {errors.firstName && (
                                    <p className="error-message">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="lastName"
                                    className="input-label-modern"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    {...register("lastName")}
                                    placeholder="Last name"
                                    className={`input-field-modern ${
                                        errors.lastName ? "input-error" : ""
                                    }`}
                                />
                                {errors.lastName && (
                                    <p className="error-message">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="input-label-modern"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="Enter your email"
                                className={`input-field-modern ${
                                    errors.email ? "input-error" : ""
                                }`}
                            />
                            {errors.email && (
                                <p className="error-message">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="input-label-modern"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Create a password"
                                    className={`input-field-modern ${
                                        errors.password ? "input-error" : ""
                                    }`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="error-message">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="input-label-modern"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    {...register("confirmPassword", {
                                        validate: value =>
                                            value === password ||
                                            "Passwords do not match"
                                    })}
                                    placeholder="Confirm your password"
                                    className={`input-field-modern ${
                                        errors.confirmPassword
                                            ? "input-error"
                                            : ""
                                    }`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="error-message">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Sign up"}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
