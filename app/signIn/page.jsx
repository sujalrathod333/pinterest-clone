"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const SignIn = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Proper redirect after login
  useEffect(() => {
    if (session) {
      window.location.href = "/"; // better for Vercel + session sync
    }
  }, [session]);

  const handleCredentialsLogin = async () => {
    try {
      setLoading(true);

      if (!username || !password) {
        toast.error("Please provide complete details");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      setLoading(false);

      if (res?.error) {
        toast.error("Invalid credentials, try again");
        return;
      }

      // ✅ force redirect after success
      window.location.href = "/";
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/pinterest.svg"
            height={50}
            width={50}
            alt="logo"
            className="h-12 w-12"
          />
        </div>

        <h2 className="text-2xl font-bold text-center">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6 mt-1">
          Log in to continue exploring ideas
        </p>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border rounded-xl mb-3 focus:ring-2 focus:ring-red-400 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-red-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleCredentialsLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-semibold transition"
        >
          {loading ? (
            <ClipLoader color="#fff" size={18} />
          ) : (
            "Continue"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* GitHub Login */}
        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 bg-black text-white p-3 rounded-xl mb-3 hover:opacity-90 transition"
        >
          <Image src="/github.png" width={20} height={20} alt="github" />
          Continue with GitHub
        </button>

        {/* Google Login */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 border p-3 rounded-xl hover:bg-gray-100 transition"
        >
          <Image src="/google.svg" width={20} height={20} alt="google" />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-6">
          By continuing you agree to Terms & Privacy Policy
        </p>

        <p className="text-center text-sm mt-4">
          Already a member?{" "}
          <Link href="/" className="text-red-500 hover:underline">
            Go Home
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignIn;
