"use client"
import React from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FeedbackButton({
  link,
  prize,
  shopSlug,
  authToken,
}: {
  link: string;
  prize: string;
  shopSlug: string;
  authToken: string;
}) {
  const handleClick = async () => {
    try {
      await axios.post(
        `${API_URL}/review_track`,
        {
          shop_slug: shopSlug, // Include shop_slug in the body
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      // Redirect to the provided link
      window.location.href = link;
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border p-4 px-5"
    >
      <img src="/google-icon-review.png" className="w-16" alt="Google Icon" />
      <h3 className="flex-inline text-left font-body4 text-[.9rem] font-medium">
      Earn
        <span className="rounded-full bg-yellow-100 px-2 py-0.5 font-semibold">
          {prize}
        </span>
        Loyalty Points by Sharing Your Experience! 🌟
      </h3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-10 text-yellow-500"
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
