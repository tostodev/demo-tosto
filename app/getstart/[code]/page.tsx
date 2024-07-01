// 'use server'
// import Loader from '@/components/layout/Loader';
// import axios from 'axios';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import React from 'react'

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// async function getToken(code: string): Promise<any> {
//   try {
//     const res = await fetch(`${API_URL}/token`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ uniquecode: code }),
//     });

//     if (!res.ok) {
//       console.error(`HTTP error! tokennn: ${res.status}`);
//       return null;
//     }

//     const contentType = res.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       console.error("Received non-JSON tokennn from the server");
//       return null;
//     }

//     const token: any = await res.json();
//     console.log("Token fetchedvvvvvvvvvvv:", token);
//     return token;
//   } catch (error) {
//     console.error("An error tokenn while fetching the shop details:", error);
//     return null;
//   }
// }

// export default async function getstart({
//   searchParams,
// }: {
//   searchParams: {
//     code: string;
//   };
// }) {
//   try {
//     console.log(searchParams, "searchParams");

//     if (!searchParams || !searchParams.code) {
//       throw new Error("Invalid search parameters");
//     }

//     const token = await getToken(searchParams.code);
// console.log(token, "token");
//     if (!token || !token.token || !token.redirect) {
//       throw new Error("Failed to fetch token or invalid token response");
//     }

//     console.log(token, "token");

//     const response = await axios.post(`/api/auth/getToken`, {
//       token: token.token,
//       shops: token.redirect,
//     });

//   } catch (error) {
//     console.error("An error occurred in getstart function:", error);
//     // Optionally, you can return a custom error component or message
//   }

//   return (
//     <Loader />
//   );
// }

// "use server";

// import { NextResponse } from "next/server";
// import axios from "axios";
// import { cookies } from "next/headers";
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function POST(req: Request, res: NextResponse) {
//   const body = await req.json();
//   const searchParam = body.searchParam;
//   try {
//     const response = await axios.post(`${API_URL}/token`, {
//       uniquecode: searchParam,
//     });
//     const token = response.data.token;
//     const redirect = response.data.redirect;
//     console.log("Token fetched:", token);
//     const shops = [redirect];

//     // Set the JWT token as a cookie
//     cookies().set({
//       name: "token",
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//     });
//     cookies().set("shop", JSON.stringify(shops), { path: "/" });
//     // localStorage.setItem("token", token);

//     return NextResponse.json({ token, redirect }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Error fetching token" },
//       { status: 500 }
//     );
//   }
// }

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/layout/Loader";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export default function Page({ params }: { params: { code: string } }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post(`${API_URL}/tokenDemo`, {
          uniquecode: params.code,
        });
        console.log(response, "response");

        // const res = await axios.post("/api/auth/gettoken", {
        //   token: response.data.token,
        //   shop: response.data.redirect,
        // });
        // console.log(res.data, "res.data");
        const shops = [response.data.redirect];

        setCookie("token", response.data.token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365 * 1000,
          expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000),
        });
        setCookie("shops", shops, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365 * 1000,
          expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000),
        });

        router.push("/" + `${response.data.redirect}`);
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.code) {
      fetchToken();
    } else {
      setLoading(false);
    }
  }, []);

  return <div>{loading ? <Loader /> : <Loader />}</div>;
}
