import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Login from "@/components/Login/login";
import Chart from "@/components/Chart/chart";
import { FaGoogle } from "react-icons/fa";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <section className="flex min-h-screen w-full flex-col bg-gradient-to-br from-gray-900 to-black">
      {session?.user && session.user.name !== null ? (
        <div className="flex flex-1 items-center justify-center">
          <Chart session={session as { user: { name?: string | undefined } }} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-2xl backdrop-filter backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-300 mb-8 text-center">
              Please sign in to access your chart
            </p>
            <button className="w-full bg-white text-gray-800 flex items-center justify-center py-3 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <FaGoogle className="mr-2" />
              <Login />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}