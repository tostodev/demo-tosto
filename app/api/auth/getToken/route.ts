import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body, "body");

    const token = body.token;

    const shop = body.shop;

    console.log(token, "token");
    console.log(shop, "shopjjj");

    const shops = [shop];

    if (token) {
      cookies().set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      cookies().set("shop", JSON.stringify(shops), { path: "/" });
    }

    return NextResponse.json({ shop }, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// export async function POST(req: Request, res: NextResponse) {
//   const body = await req.json();
//   const token = body.token;
//   const shop = body.shops;
//       const shops = [shop];

//   try {
//     cookies().set({
//       name: "token",
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//     });
//     cookies().set("shop", JSON.stringify(shops), { path: "/" });

//   return NextResponse.redirect(new URL(`/${shop}`, req.url))
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Error fetching token" },
//       { status: 500 }
//     );
//   }
// }
