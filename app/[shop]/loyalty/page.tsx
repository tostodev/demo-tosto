import React from "react";
import Link from "next/link";
import { Button, Spinner } from "@nextui-org/react";
import Qr from "@/components/qrcode/Qr";
import MenuBarMobile from "@/components/sidebar/MenuMobile";
import { LoyaltyProgram } from "@/type";
import { cookies } from "next/headers";
import Redeem from "@/components/Redeem_loyalty";
import { supabase } from "@/utils/supabase/client";
import { ShopDataP } from "@/type";

// import { useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
async function getLocalShopData(slug: string): Promise<ShopDataP | null> {
  const { data, error } = await supabase
    .from("Demo")
    .select()
    .eq("url_identifier", slug);
  if (error) {
    console.error("Error fetching shop data:", error);
    return null;
  }
  if (data) {
    console.log("Shop data fetched successfully:", data);
    return data[0];
  }
  return null;
}

async function getShop(slug: string): Promise<LoyaltyProgram | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  try {
    const res = await fetch(`${API_URL}/loyalty_details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shop_slug: slug }),
    });

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return null; // Return null if the response is not ok
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Received non-JSON response from the server");
      return null; // Return null if the response is not JSON
    }

    const loyaltyData: LoyaltyProgram = await res.json();
    console.log("Loyalty fetched successfully:", loyaltyData);
    return loyaltyData;
  } catch (error) {
    console.error("An error occurred while fetching the shop details:", error);
    return null; // Return null if there's an error in the fetch process
  }
}

export default async function page({ params }: { params: { shop: string } }) {
  const shop = params.shop;
  const LoyaltyData: LoyaltyProgram | null = await getShop("tosto");
  const LocalShopData: ShopDataP | null = await getLocalShopData(shop);
  if (!LoyaltyData) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <Spinner color="danger" />
      </div>
    );
  }

  const cardBackgroundSvg = `
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="10%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(230,230,240);stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad1)" />
</svg>

`;

  const encodedSvg = encodeURIComponent(cardBackgroundSvg);

  const backgroundImage = `url("data:image/svg+xml,${encodedSvg}")`;
  if (!LocalShopData) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <Spinner color="danger" />
      </div>
    );
  }

  return (
    LoyaltyData.loyalpageDetails.loyaltystatus && (
      <div>
        <div className="w-full min-w-lg bg-white top-0 absolute left-0  sm:flex  min-h-screen  sm:justify-center sm:flex-col sm:items-center">
          <div
            className="xl:max-w-sm sm:max-w-lg    w-full bg-cover relative   sm:border-2 min-h-screen sm:rounded-3xl "
            style={{ borderColor: LocalShopData.Colour }}
          >
            <div
              className="flex flex-col min-w-lg  z-10  relative isolate  sm:rounded-3xl  items-center justify-center"
              style={{ background: LocalShopData.Colour }}
            >
              <div className="absolute min-w-xl  bg-[url(https://hyperlaneacademy.vercel.app/noise.png)]  sm:rounded-3xl obejct-cover bg-cover  opacity-60 min-w-7xl inset-0"></div>
              <div className="absolute z-0 bg-gradient-to-b from-transparent to-[#ffffff90]  w-full   obejct-cover bg-cover  opacity-50  min-w-7xl inset-0"></div>
              <nav className="flex w-full z-50 p-6 justify-between items-center  mt-1">
                <div className="flex justify-center items-center gap-2">
                  <img
                    src={LocalShopData.Logo}
                    className="h-12 rounded-full border border-white object-cover "
                  />
                  <h1 className="text-xl font-body4 font-bold text-center text-white   capitalize">
                    {LocalShopData.ShopName}{" "}
                  </h1>
                </div>{" "}
                <MenuBarMobile />
              </nav>

              <div className="w-full mt-7 -mb-16 flex  justify-center items-center flex-col px-6">
                <div className="bg-white flex py-4 opacity-70 rounded-t-xl z-30  w-[90%]"></div>
                <div
                  style={{
                    backgroundImage: backgroundImage,
                    backgroundSize: "cover", // adjust as necessary
                    backgroundRepeat: "no-repeat",
                  }}
                  className="bg-white px-6 flex shadow-sm flex-col justify-between py-6  gap-8 -mt-5 z-50 rounded-2xl w-full"
                >
                  <div className="flex flex-row justify-between">
                    <div className="pt-2">
                      <p className="font-body4 text-sm text-black/80">
                        Your Loyalty Point
                      </p>
                      <h2 className="text-3xl font-body4 text-black font-bold">
                        {LoyaltyData.loyalpageDetails.loyaltypoints}
                      </h2>
                    </div>
                    <div className="flex gap-3 justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#000"
                        className="size-16 opacity-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                      {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 opacity-60"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg> */}
                    </div>
                  </div>

                  <div className="flex gap-3  justify-between  items-center">
                    <h2 className="font-body4 text-xl font-semibold">
                      {LoyaltyData.loyalpageDetails.username}
                    </h2>
                    <div className=" flex justify-center items-center">
                      <Redeem id={LoyaltyData.loyalpageDetails.loyalqr_text} />
                    </div>
                  </div>
                </div>
              </div>

              <BottomElement />
            </div>

            <div className="flex h-full  flex-col sm:rounded-b-3xl pt-6 mt-5 justify-start pb-16 items-center min-h-[62vh]  sm:pt-10  relative z-50 bg-white   gap-5 px-6">
              {" "}
              <div
                // style={{ borderColor: LocalShopData.Colour}}
                className="flex flex-col justify-center w-full items-center gap-3  p-4  rounded-2xl"
              >
                {" "}
                <hr className=" h-2  w-full"></hr>
                <h2 className="w-fit font-body4 pb-6 -mt-[2.1rem] px-3 bg-white   flex justify-center font-medium text-xl">
                  Unveiling point values
                </h2>
                <div
                  style={{ background: LocalShopData.Colour }}
                  className="w-full  rounded-[1.1rem] shadow-xs "
                >
                  {" "}
                  <div className="bg-white/[96%] p-5 flex  items-center flex-col font-body4 rounded-2xl mt-[.1rem] w-full">
                    <p className="w-fit flex absolute justify-center text-sm items-center px-3 py-1 -mt-9 font-medium bg-white rounded-full border">
                      ₹{LoyaltyData.loyalpageDetails.amount_spent} Spend ={" "}
                      {LoyaltyData.loyalpageDetails.points_per_amount} Point
                    </p>

                    <div className="grid w-full gap-2 grid-cols-6 mt-3 ">
                      {LoyaltyData.loyalpageDetails.rewards.map(
                        (reward, index) => (
                          <>
                            <p className="col-span-1 font-semibold flex justify-start text-lg items-center">
                              {reward.points_needed}{" "}
                            </p>
                            <p className="col-span-1 flex items-center justify-center text-xs">
                              PTS
                            </p>
                            <p className="col-span-4 bg-white/50 pl-3 rounded-full  font-medium flex items-center justify-start text-sm">
                              {reward.reward}{" "}
                            </p>
                          </>
                        )
                      )}
                    </div>
                  </div>
                </div>{" "}
              </div>{" "}
              <div
                // style={{ borderColor: LocalShopData.Colour}}
                className="flex flex-col justify-center w-full items-center gap-3  p-4  rounded-2xl"
              >
                {" "}
                <hr className=" h-2  w-full"></hr>
                <h2 className="w-fit font-body4 pb-3  -mt-[2.1rem] px-3 bg-white   flex justify-center font-medium text-xl">
                  How to remdeem{" "}
                </h2>{" "}
                <div className="bg-white bg border  p-3 flex  items-center flex-col font-body4 rounded-2xl mt-[.1rem] w-full">
                  <Qr
                    text={LoyaltyData.loyalpageDetails.loyalqr_text}
                    size={160}
                  />
                  <p className="mt-1 mb-1 font-semibold text-sm">
                    Show This QR to Cashier
                  </p>
                </div>
              </div>
              <footer className="flex font-body4 mt-3  z-40 justify-start w-full flex-col">
                <div className="flex w-full py-4 border-t border-b justify-between">
                  <div>
                    <h3 className="font-bold text-lg">
                      {LoyaltyData?.shopDetails.shopname}
                    </h3>
                    <p>{LoyaltyData?.shopDetails.shopplace}</p>
                  </div>{" "}
                  <div className="flex gap-2 justify-center items-center">
                    {LoyaltyData?.shopDetails.shopinsta && (
                      <Link
                        href={LoyaltyData?.shopDetails.shopinsta || ""}
                        className="inline-flex  bg-slate-100 h-10 w-10 flex-col items-center justify-center px-5 rounded-full hover:bg-gray-50  group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          className="size-5"
                          viewBox="0 0 48 48"
                        >
                          {" "}
                          <path d="M 16.5 5 C 10.16639 5 5 10.16639 5 16.5 L 5 31.5 C 5 37.832757 10.166209 43 16.5 43 L 31.5 43 C 37.832938 43 43 37.832938 43 31.5 L 43 16.5 C 43 10.166209 37.832757 5 31.5 5 L 16.5 5 z M 16.5 8 L 31.5 8 C 36.211243 8 40 11.787791 40 16.5 L 40 31.5 C 40 36.211062 36.211062 40 31.5 40 L 16.5 40 C 11.787791 40 8 36.211243 8 31.5 L 8 16.5 C 8 11.78761 11.78761 8 16.5 8 z M 34 12 C 32.895 12 32 12.895 32 14 C 32 15.105 32.895 16 34 16 C 35.105 16 36 15.105 36 14 C 36 12.895 35.105 12 34 12 z M 24 14 C 18.495178 14 14 18.495178 14 24 C 14 29.504822 18.495178 34 24 34 C 29.504822 34 34 29.504822 34 24 C 34 18.495178 29.504822 14 24 14 z M 24 17 C 27.883178 17 31 20.116822 31 24 C 31 27.883178 27.883178 31 24 31 C 20.116822 31 17 27.883178 17 24 C 17 20.116822 20.116822 17 24 17 z"></path>{" "}
                        </svg>{" "}
                      </Link>
                    )}
                    {LoyaltyData?.shopDetails.shopplace && (
                      <Link
                        href={LoyaltyData?.shopDetails.shopmap || ""}
                        className="inline-flex  bg-slate-100 h-10 w-10 flex-col items-center justify-center px-5 rounded-full hover:bg-gray-50  group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                      </Link>
                    )}
                    {LoyaltyData?.shopDetails.shopphone && (
                      <Link
                        href={"tel:" + LoyaltyData?.shopDetails.shopphone || ""}
                        className="inline-flex  bg-slate-100 h-10 w-10 flex-col items-center justify-center px-5 rounded-full hover:bg-gray-50  group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                          />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center gap-2 mt-4 ">
                  <p className="text-xs">Privacy Policy </p>
                  <p className="text-xs">Terms And Conditions</p>
                </div>
                <Link
                  href="https://tosto.in"
                  className="flex w-full my-7 font-body3 justify-center items-center"
                >
                  Made With <span className="text-red-500 ml-1">tosto.in</span>
                </Link>
              </footer>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

const BottomElement = () => (
  <svg
    width="5997"
    height="825"
    viewBox="0 0 5997 825"
    fill="none"
    strokeWidth={1.5}
    xmlns="http://www.w3.org/2000/svg"
    className="w-full relative h-full  bottom-0 z-40 right-0   "
  >
    <path
      d="M1098.63 219.461C1713.75 216.947 2301.2 515.668 2912.3 457.013C3245.26 424.753 3548.54 289.009 3853.84 174.213C4159.64 59.8356 4495.11 -37.364 4824.55 14.1685C5145.94 64.0252 5425.58 250.883 5752 267.641C5868.69 273.926 5995.43 259.262 6094.01 311.633C6219.25 377.829 6280.76 701.687 6237 819.835C6399.87 1258.49 5837.5 1025.55 5556.85 1084.2C5276.2 1142.86 4982.48 1129.45 4693.27 1143.69C4020.82 1176.79 3369.49 1360.3 2697.54 1402.61C1891.8 1453.31 1085.05 1300.39 277.804 1330.13C156.088 1334.74 32.8637 1343.12 -86.3374 1322.17C-205.538 1300.81 -322.728 1244.66 -373.526 1152.49C-458.526 999.57 -302.106 923.738 -209.562 819.835C-105.953 703.782 -3.34912 597.366 134.461 506.87C407.065 327.553 750.082 220.717 1098.63 219.461Z"
      fill="white"
    />
  </svg>
);
