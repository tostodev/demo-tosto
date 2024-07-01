"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Sub_roles {
  id: number;
  created_at: string;
  username: string;
  password: string;
  shop_id: number;
}

export default function Login() {
  // State variables to store username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Function to handle login is here
  const handleLogin = async () => {
    if (password === "Dreamtosto20@4") {
      // If login is successful, get JWT token from response
      localStorage.setItem("token", "Dreamtosto20@4");
      // Optionally, you can redirect the user to another page after successful login
      router.push("/");
    } else {
      // Handle login error
      alert("Invalid password");
    }
  };

  return (
    <section className="bg-white ">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full lg:h-screen ">
        <div className="relative hidden items-end px-8 lg:flex sm:flex sm:pb-16 md:justify-center bg-gray-50 sm:px-10 lg:px-10">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="object-cover  rounded-r-xl  w-full h-full"
            >
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#480d0d] to-transparent"></div>

          <div className="flex flex-col h-full py-9 justify-between w-full">
            <div className="flex w-full z-20 justify-between">
              <Link href="/" title="" className="flex">
                <img className=" h-8 lg:h-12 " src="/logo1w.png" alt="" />
              </Link>
            </div>
            <div className="relative ">
              <div className="w-full max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
                <h3 className="text-4xl -mt-20 ml-4 sm:hidden lg:block  tracking-wide font-body4 w-full text-white">
                  Grow your restaurent with us
                  <br className="hidden xl:block" />
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="gap-2">
          <div className="flex sm:hidden items-center pb-44 sm:pb-0 bg-[#480d0d] sm:bg-white justify-between sm:justify-end px-7 py-4 sm:px-8 lg:px-16 sm:py-9 lg:py-9">
            <div className="fixed block sm:hidden z-10 inset-0">
              <video
                loop
                autoPlay
                className=" object-fill opacity-10 w-full overflow-auto"
              >
                <source src="/video.mp4" type="video/mp4" />
              </video>
            </div>
            <Link href="/" title="" className="flex z-50 sm:hidden">
              <img className="w-auto h-8 lg:h-12 " src="/logo1w.png" alt="" />
            </Link>
          </div>

          <div className="flex z-50 h-full sm:mt-0 -mt-20 relative items-center justify-center px-4 py-10  sm:px-2 lg:px-8 sm:pb-29 lg:pb-24 sm:pt-16">
            <div className="xl:w-full  xl:max-w-sm 2xl:max-w-md bg-white -mt-28 sm:mt-0 xl:mx-auto px-8 rounded-lg sm:rounded-none sm:px-4 py-10  ">
              <h2 className="text-3xl  font-body3 leading-tight text-black sm:text-4xl">
                Welcome back!
              </h2>

              <div className="mt-8">
                <div className="space-y-5">
                  
                  <div>
                    <label className="text-sm font-body text-gray-900">
                      Password
                    </label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                      <input
                        required
                        type="password"
                        placeholder="Enter password"
                        className="block w-full py-3 pl-12 pr-4 md:py-4 lg:py-4 font-body text-sm text-black placeholder-gray-500 transition-all duration-200 border border-gray-300 rounded-full bg-white focus:outline-none focus:border-gray-600 focus:bg-white caret-gray-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={handleLogin}
                      className="w-full mt-3 rounded-full bg-red-500"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
