"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <button onClick={() => signOut()} className=" hover:text-green-400">
      Logout
    </button>
  );
}