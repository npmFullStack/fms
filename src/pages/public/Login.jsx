import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../config/axios";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "../../schemas/authSchema";
import loginImage from "../../assets/images/login.png";
import useAuthStore from "../../utils/store/useAuthStore";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange"
    });

    const { setUser, setLoading } = useAuthStore();

    const onSubmit = async data => {
        setLoading(true);
        try {
            const loginRes = await api.post("/auth/login", data);
            const token = loginRes.data?.token;

            if (!token) throw new Error("No token received");

            localStorage.setItem("token", token);

            const profileRes = await api.get("/auth/profile");
            setUser(profileRes.data.user);

            navigate("/dashboard");
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center px-4 font-[Poppins]">
            {/* ✅ Fixed Background Grid */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

            {/* Main Container */}
            <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Image Section */}
                <div className="hidden md:block md:w-1/2">
                    <img
                        src={loginImage}
                        alt="Login"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="mb-8 text-center">
                        <h1 className="page-title">Welcome back!</h1>
                        <p className="page-subtitle">Sign in to your account</p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Error Message */}
                        {message && (
                            <div className="error-message">
                                {message}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="Enter your email"
                                className={`input-field ${errors.email ? "input-error" : ""}`}
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
                                className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Enter your password"
                                    className={`input-field ${errors.password ? "input-error" : ""}`}
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

                        {/* Forgot Password Link */}
                        <div className="text-right text-sm">
                            <Link
                                to="/forgot-password"
                                className="text-blue-600 hover:text-blue-500"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn-primary w-full"
                        >
                            Sign in
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;