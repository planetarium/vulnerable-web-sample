"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function Vouchers({ user, refreshUserData }: any) {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch("/api/vouchers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch vouchers");
        }

        const data = await response.json();
        setVouchers(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleUseVoucher = async (voucherId: number) => {
    try {
      const response = await fetch("/api/vouchers/draw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ voucherId }),
      });

      if (!response.ok) {
        throw new Error("Failed to use voucher");
      }

      // After using the voucher, refresh the user data and vouchers
      await refreshUserData();
      const updatedVouchers = await fetch("/api/vouchers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await updatedVouchers.json();
      setVouchers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading vouchers...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-md mt-6 bg-gray-800 rounded text-white p-3">
      <h3 className="text-lg font-semibold mb-4">Vouchers</h3>
      <ul className="space-y-2">
        {vouchers.map((voucher) => (
          <li
            key={voucher.id}
            className="p-4 bg-gray-600 rounded shadow flex justify-between items-center"
          >
            <div>
              <span>
                {new Date(voucher.createdAt).toLocaleString()}
              </span>
              <div className="flex items-center">
                <span className="text-yellow-500 text-2xl">🥇</span>
                <span className="ml-2 text-lg">{voucher.gold} Gold</span>
              </div>
            </div>
            {voucher.status === "ISSUED" && (
              <button
                onClick={() => handleUseVoucher(voucher.id)}
                className="ml-4 py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Use
              </button>
            ) || (<button disabled>Used</button> )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Vouchers;