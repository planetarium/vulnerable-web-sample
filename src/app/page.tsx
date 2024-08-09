"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Vouchers from "@/app/components/Vouchers";
import IssueVoucher from "@/app/components/IssueVoucher";
import Withdrawal from "@/app/components/Withdrawal";

export default function Home() {
  const [me, setMe] = useState<any>(null);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("User not authenticated");
      }

      const user = await response.json();
      if (user && user.id) {
        setMe(user); // Set user data if authenticated
      } else {
        throw new Error("User not authenticated");
      }
      console.log("Authenticated user:", user);
    } catch (err: any) {
      console.error(err.message);
      router.push("/login"); // Redirect to login on error
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login"); // Redirect to login if token is missing
      return;
    }

    fetchUserData();
  }, [router]);

  // Function to handle logout
  const handleLogout = () => {
    Cookies.remove("token"); // Remove the token from cookies
    setMe(null); // Clear user data
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center min-h-screen">
      {me ? (
        <>
          <p className="text-xl font-semibold">Welcome, {me.userId} (id#{me.id})!</p>
          {me?.isAdmin && <a href={'/admin'} className={'underline text-red-500'}>Admin Page</a>}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center">
              <span className="text-yellow-500 text-2xl">🥇</span>
              <span className="ml-2 text-lg">{me.gold} Gold</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-600 text-2xl">$</span>
              <span className="ml-2 text-lg">{me.usd.toFixed(2)} USD</span>
            </div>
          </div>
          <Withdrawal availableGold={me.gold} refreshUserData={fetchUserData} />
          {me && <Vouchers user={me} refreshUserData={fetchUserData} />}
          <button
            onClick={handleLogout}
            className="mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}