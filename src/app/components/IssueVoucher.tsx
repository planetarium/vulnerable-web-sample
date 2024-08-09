"use client";
import { useState } from "react";
import Cookies from "js-cookie";

function IssueVoucher() {
  const [userId, setUserId] = useState("");
  const [gold, setGold] = useState("");
  const [message, setMessage] = useState("");

  const handleUserIdChange = (e: any) => {
    // Remove any non-digit characters to ensure only integers
    const value = e.target.value.replace(/\D/g, "");
    setUserId(value);
  };

  const handleGoldChange = (e: any) => {
    // Remove any non-digit characters to ensure only integers
    const value = e.target.value.replace(/\D/g, "");
    setGold(value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage(""); // Reset the message

    if (!userId || !gold) {
      setMessage("Please provide both User ID and Gold amount.");
      return;
    }

    try {
      const response = await fetch("/api/admin/issueVoucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          userId: parseInt(userId, 10),
          gold: parseInt(gold, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to issue voucher.");
      }

      setMessage("Voucher issued successfully.");
      setUserId("");
      setGold("");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mt-8 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Issue a Voucher</h3>
      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-1">
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={handleUserIdChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="id of user"
            required
          />
          <input
            type="text"
            id="gold"
            value={gold}
            onChange={handleGoldChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="gold amount"
            required
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Issue Voucher
          </button>
        </div>
      </form>
    </div>
  );
}

export default IssueVoucher;