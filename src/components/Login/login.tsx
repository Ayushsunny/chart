"use client";
import React from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <button
      onClick={() => signIn("google")}
      className="text-blue-400"
    >
      Login
    </button>
  );
}
