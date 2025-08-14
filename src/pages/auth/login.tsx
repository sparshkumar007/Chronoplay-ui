"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { LOGIN_API } from "@/constants/api";
import SuccessPopup from "@/components/SuccessPopup";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Login() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState(""); // <-- added this

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            router.replace("/"); // redirect to home if already logged in
        }
    }, [router]);

    const validateForm = () => {
        if (password.length < 6 || password.length > 15) {
            setError("Password must be 6-15 characters long.");
            return false;
        }
        return true;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await fetch(LOGIN_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Invalid credentials");
            }

            const data = await res.json();
            console.log("Login successful:", data);
            localStorage.setItem("authToken", data?.data?.token);

            // Set message from backend response
            setSuccessMessage(data.message || "Login successful!");

            // Show success popup
            setShowSuccessPopup(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle OK click on popup
    const handlePopupOk = () => {
        setShowSuccessPopup(false);
        router.push("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50 dark:bg-bg-dark transition-colors">
            {showSuccessPopup ? (
                <SuccessPopup
                    message={successMessage}
                    onOk={handlePopupOk}
                />
            ) : (
                <div className="bg-primary-100 dark:bg-surface-dark shadow-lg rounded-xl p-8 w-full max-w-md border border-primary-200 dark:border-primary-700">
                    <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-6 text-center">
                        Login
                    </h2>

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-primary-700 dark:text-primary-300 mb-1">Email</label>
                            <input
                                type="text"
                                name="email or username"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-primary-300 dark:border-primary-600 
                         bg-primary-50 dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:outline-none 
                         focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                                placeholder="Enter your email or username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-primary-700 dark:text-primary-300 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 rounded-lg border border-primary-300 dark:border-primary-600 
                           bg-primary-50 dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:outline-none 
                           focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-2 flex items-center text-primary-500 dark:text-primary-400 cursor-pointer hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 text-primary-50 rounded-lg 
                       transition-colors font-semibold disabled:opacity-50 shadow-md border border-primary-800 dark:border-primary-500"
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>

                        <p className="mt-4 text-sm text-primary-600 dark:text-primary-400">
                            Don't have an account?{" "}
                            <Link href="/auth/signup" className="text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 hover:underline font-semibold transition-colors">
                                Sign up here
                            </Link>
                        </p>
                    </form>
                </div>
            )}
        </div>
    ); " "
}
