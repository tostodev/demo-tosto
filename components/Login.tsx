"use client";
import React, { useState } from "react";
import { CoolMode } from "@/components/magicui/cool-mode";
import { Button } from "@/components/ui/button";
// import { Spinner } from "@nextui-org/react";
import { setCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Login({
  name,
  token,
  slug,
  shops,
}: {
  name: string;
  token: string;
  slug: string;
  shops: string[];
}) {
  // Click handler function

  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/new_shop_login`, {
        // Replace with your actual endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shop_slug: slug }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
      const updatedShops = [...shops, slug];

      setCookie("shops", JSON.stringify(updatedShops), {
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 1000, // 1000 years for demonstration, adjust as necessary
        expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000), // Adjust as necessary
      });
      window.location.reload();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative left-0 top-0 z-50 flex h-96 w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center rounded-2xl border p-6">
        <h2 className="font-body4 text-xl">Get Started {name}</h2>
        <div className="w-full py-6">
          <CoolMode>
            <Button
              onClick={handleClick}
              className={`w-full border-2 border-black/60 bg-white font-body4 font-semibold text-black hover:bg-slate-100`}
            >
              {loading ? "Loading..." : "Get Started"}
            </Button>
          </CoolMode>
        </div>
        <p className="font-body4 text-xs">
          Read terms and condition and privacy policy
        </p>
      </div>
    </div>
  );
}
