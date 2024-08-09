"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Vouchers from "@/app/components/Vouchers";
import IssueVoucher from "@/app/components/IssueVoucher";
import Withdrawal from "@/app/components/Withdrawal";

export default function Admin() {
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
      if (user && user.isAdmin) {
        setMe(user); // Set user data if authenticated
      } else {
        throw new Error("User not authenticated");
      }
      console.log("Authenticated user:", user);
    } catch (err: any) {
      console.error(err.message);
      router.push("/"); // Redirect to login on error
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

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center min-h-screen">
      {me ? (
        <>
          <p className="text-xl font-semibold">Admin Page :: Issue Vouchers</p>
          {me?.isAdmin && <IssueVoucher />}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}