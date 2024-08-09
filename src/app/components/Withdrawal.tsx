"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Withdrawal({ refreshUserData, availableGold }: any) {
  const [goldAmount, setGoldAmount] = useState("");
  const [message, setMessage] = useState("");
  const [goldPrice, setGoldPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await fetch("https://api.9cscan.com/price");
        if (!response.ok) {
          throw new Error("Failed to fetch gold price.");
        }
        const data = await response.json();
        setGoldPrice(data.quote.USD.price);
      } catch (error) {
        console.error("Error fetching gold price:", error);
        setGoldPrice(null);
      }
    };

    fetchGoldPrice();
  }, []);

  const handleGoldChange = (e: any) => {
    // Remove any non-digit characters to ensure only integers
    const value = e.target.value.replace(/\D/g, "");
    setGoldAmount(value);
  };

  const handleWithdraw = async (e: any) => {
    e.preventDefault();
    setMessage(""); // Reset the message

    const gold = parseInt(goldAmount, 10);

    if (!gold || gold < 1) {
      setMessage("Please enter a valid amount of Gold (minimum 1).");
      return;
    }

    if (gold > availableGold) {
      setMessage(`You can withdraw up to ${availableGold} Gold only.`);
      return;
    }

    try {
      const response = await fetch("/api/withdrawal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ gold }),
      });

      if (!response.ok) {
        throw new Error("Failed to withdraw Gold.");
      }

      setMessage("Gold successfully converted to USD.");
      setGoldAmount("");
      refreshUserData(); // Refresh user data to reflect the updated balance
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mt-8 p-4 bg-white rounded shadow relative">
      <h3 className="text-lg font-semibold mb-4">Withdraw Gold to USD</h3>
      {goldPrice !== null && (
        <div className="absolute top-4 right-4 text-sm text-gray-600">
          🥇: ${goldPrice.toFixed(3)} USD
        </div>
      )}
      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
      <form onSubmit={handleWithdraw} className="space-y-4">
        <div className="flex space-x-1">
          <input
            type="text"
            id="goldAmount"
            value={goldAmount}
            onChange={handleGoldChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="amount of gold"
            required
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Withdraw
          </button>
        </div>
      </form>
    </div>
  );
}

export default Withdrawal;