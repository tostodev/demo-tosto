import React from "react";
import Link from "next/link";
import MenuMobile from "@/components/sidebar/MenuMobile";
import { cookies } from "next/headers";
// import { Spinner } from "@nextui-org/react";
import ShineBorder from "@/components/magicui/shine-border";
import { ShopDataP } from "@/type";
import { supabase } from "@/utils/supabase/client";

import RefferButton from "@/components/referral/RefferButton";
import FeedbackButton from "@/components/FeedbackButton";

type PageData = {
  shopname: string;
  shopplace: string;
  shopphone: number;
  shopinsta: string;
  shopmap: string;
  shoplogo: string;
  shopcolor: string;
  username: string;
  total_points: number;
  clientdb_id: number;
  userdb_id: number;
  feedback_prize: string;
  points_per_referral: number;
  points_after_visit: number;
  feedback_terms: string[];
  feedback_status: boolean;
  googlereview: boolean;
  referral_terms: string[];
  referral_reward: Reward[]; // Use the defined Reward type
  arrival_terms: string[];
  arrival_reward: string;
  referral_status: boolean;
  loyalty_status: boolean;
  loyalty_points: number;
  loyalty_id: string;
  feedback_redirect: string;
  menu: boolean;
};
type Reward = {
  reward: string;
  no_of_referral: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function generateStaticParams() {
//   return [{ shop: "tokos" }];
// }

// export const revalidate = 60;

async function getShop(slug: string, token: any): Promise<PageData | null> {
  try {
    const res = await fetch(`${API_URL}/user_homepage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shop_slug: "tosto" }),
    });

    if (!res.ok) {
      return null;
      // notFound(); // Show 404 page if shop is not found
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Received non-JSON response from the server");
      return null; // Return null if the response is not JSON
    }

    const shop: any = await res.json();
    console.log("Shop details fetched successfully:", shop);
    return shop.pageData;
  } catch (error) {
    console.error("An error occurred while fetching the shop details:", error);
    return null; // Return null if there's an error in the fetch process
  }
}

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

export default async function page({
  params,
  searchParams,
}: {
  params: { shop: string };
  searchParams: {
    login: boolean;
  };
}) {
  const shop = params.shop;
  const cookieStore = cookies();
  const authToken = cookieStore.get("token");
  const shopData: PageData | null = await getShop(shop, authToken?.value);
  const LocalShopData: ShopDataP | null = await getLocalShopData(shop);
  console.log(shopData, "shopData");
  if (!shopData) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        {/* <Spinner color="danger" /> */}
        <p>Loading..</p>
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
      <>
        <p>Sorry no Store Found</p>
      </>
    );
  }

  return (
    <div>
      <div className="min-w-lg absolute left-0 top-0 min-h-screen w-full bg-white sm:flex sm:flex-col sm:items-center sm:justify-center">
        <div
          className="relative min-h-screen w-full bg-cover sm:max-w-lg sm:rounded-3xl sm:border-2 xl:max-w-sm"
          style={{ borderColor: LocalShopData?.Colour }}
        >
          <div
            className="min-w-lg relative isolate z-10 flex flex-col items-center justify-center sm:rounded-3xl"
            style={{ background: LocalShopData?.Colour }}
          >
            <div className="min-w-xl obejct-cover min-w-7xl absolute inset-0 bg-[url(https://hyperlaneacademy.vercel.app/noise.png)] bg-cover opacity-60 sm:rounded-3xl"></div>
            <div className="obejct-cover min-w-7xl absolute inset-0 z-0 w-full bg-gradient-to-b from-transparent to-[#ffffff90] bg-cover opacity-50"></div>
            <nav className="z-50 mt-1 flex w-full items-center justify-between p-6">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={LocalShopData?.Logo}
                  className="h-12 rounded-full border border-white object-cover"
                />
                <h1 className="text-center font-body4 text-xl font-bold capitalize text-white">
                  {LocalShopData.ShopName}{" "}
                </h1>
              </div>{" "}
              <MenuMobile />
            </nav>

            <div
              style={{
                zIndex: 500,
              }}
              className="z-50 flex w-full flex-col items-start justify-center px-6"
            >
              <h1 className="font-body4 text-2xl font-bold text-white">
                Hello {shopData.username},
              </h1>
              <p className="font-body4 text-sm text-white">
                What would you like to do today?
              </p>
            </div>

            {shopData.loyalty_status && (
              <div className="-mb-16 mt-7 flex w-full flex-col items-center justify-center px-6">
                <div className="z-30 flex w-[90%] rounded-t-xl bg-white py-4 opacity-70"></div>
                <div
                  style={{
                    backgroundImage: backgroundImage,
                    backgroundSize: "cover", // adjust as necessary
                    backgroundRepeat: "no-repeat",
                  }}
                  className="z-40 -mt-5 flex w-full flex-row justify-between rounded-t-2xl bg-white px-6 py-5 pb-16 shadow-sm"
                >
                  <div className="pt-2">
                    <p className="font-body4 text-sm text-black/80">
                      Your Loyalty Point
                    </p>
                    <h2 className="font-body4 text-3xl font-bold text-black">
                      {shopData.loyalty_points}
                    </h2>
                  </div>
                  <div className="flex items-center justify-center gap-3">
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
              </div>
            )}

            <BottomElement />
          </div>

          <div className="relative z-50 -mt-1 flex h-full min-h-[62vh] flex-col items-center justify-start gap-5 bg-white px-6 pb-16 pt-5 sm:rounded-b-3xl sm:pt-10">
            <div className="flex w-full items-center justify-center gap-6">
              {shopData.menu && (
                <Link
                  href={"/" + shop + "/menu"}
                  className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl bg-slate-100 p-6 hover:bg-slate-50 active:bg-slate-50"
                >
                  <MenuIcon />
                  <h3 className="font-body4 text-sm font-semibold"> Menu</h3>
                </Link>
              )}
              {shopData.loyalty_status && (
                <Link
                  href={"/" + shop + "/loyalty"}
                  className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl bg-slate-100 p-6 hover:bg-slate-50 active:bg-slate-50"
                >
                  <CardIcon size={26} />
                  <h3 className="font-body4 text-sm font-semibold">
                    Loyalty Card
                  </h3>
                </Link>
              )}
            </div>
            {shopData.feedback_status &&
              (shopData.googlereview ? (
                <Link
                  href={"/" + shop + "/offer"}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border p-4 px-5"
                >
                  <div className="flex items-center justify-start gap-3">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-slate-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3.75v16.5M2.25 12h19.5M6.375 17.25a4.875 4.875 0 0 0 4.875-4.875V12m6.375 5.25a4.875 4.875 0 0 1-4.875-4.875V12m-9 8.25h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5Zm12.621-9.44c-1.409 1.41-4.242 1.061-4.242 1.061s-.349-2.833 1.06-4.242a2.25 2.25 0 0 1 3.182 3.182ZM10.773 7.63c1.409 1.409 1.06 4.242 1.06 4.242S9 12.22 7.592 10.811a2.25 2.25 0 1 1 3.182-3.182Z"
                      />
                    </svg>
                    <h3 className="flex-inline font-body4 text-base font-medium">
                      Redeem your all rewards
                    </h3>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-yellow-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ) : (
                <FeedbackButton
                  link={shopData.feedback_redirect}
                  prize={shopData.feedback_prize}
                  shopSlug={params.shop}
                  authToken={authToken ? authToken.value : ""}
                />
              ))}

            {shopData.referral_status && (
              <div
                style={{ background: shopData.shopcolor }}
                className="shadow-xs w-full rounded-[1.1rem]"
              >
                <div className="flex flex-col items-center justify-center rounded-2xl border bg-white/[98%]">
                  <div className="flex items-center justify-center gap-4 p-6">
                    <div className="flex-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-8 w-8 text-slate-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-body4 text-[.9rem] font-semibold">
                      Get Loyalty Points by Gifting a {shopData.arrival_reward}{" "}
                      with Your Friend! 🎁
                    </h3>
                  </div>
                  <div className="box-shadow w-full rounded-2xl border-t bg-white pb-6 pt-4 font-body4">
                    <div className="grid grid-cols-3 gap-4 px-6 text-center">
                      <>
                        <h4 className="col-span-2 text-left text-base font-medium">
                          Share a gift with a friend
                        </h4>
                        <p className="reward-text col-span-1 flex items-center rounded-full bg-orange-50 px-1 text-center text-sm font-semibold">
                          100 points
                        </p>
                        <h4 className="col-span-2 text-left text-base font-medium">
                          A friend visits the shop
                        </h4>
                        <p className="reward-text col-span-1 flex items-center rounded-full bg-orange-50 px-1 text-center text-sm font-semibold">
                         200 points
                        </p>
                      </>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-4 px-10">
                      <RefferButton
                        logoImageUrl={shopData.shoplogo}
                        shopColor={shopData.shopcolor}
                        cafeName={shopData.shopname}
                        cafeLocation={shopData.shopplace}
                        giftName={shopData.arrival_reward}
                        senderName={shopData.username}
                        clientdb_id={shopData.clientdb_id}
                        userdb_id={shopData.userdb_id}
                      />

                      {/* <button className="w-full">Refer Now</button> */}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* <div className="shadow-xs w-full rounded-2xl border-2 border-slate-700 bg-[url('/slate.jpg')] bg-cover bg-center object-contain p-6 font-body7 text-white">
              <div className="flex items-center justify-between border-b-2 border-slate-200">
                <h2 className="text-xl">Today's special</h2>
                <p className="text-3xl">*</p>
              </div>
              <div className="mt-4 grid w-full grid-cols-2 gap-2">
                <p>Chicke thava</p>
                <p className="text-end">$120</p> <p>Chicke thava</p>
                <p className="text-end">$120</p> <p>Chicke thava</p>
                <p className="text-end">$120</p> <p>Chicke thava</p>
                <p className="text-end">$120</p> <p>Chicke thava</p>
                <p className="text-end">$120</p>
              </div>{" "}
            </div> */}

            <footer className="z-40 mt-3 flex w-full flex-col justify-start font-body4">
              <div className="flex w-full justify-between border-b border-t py-4">
                <div>
                  <h3 className="text-lg font-bold">
                    {LocalShopData.ShopName}
                  </h3>
                  <p>{LocalShopData.ShopLocation}</p>
                </div>{" "}
                <div className="flex items-center justify-center gap-2">
                  {shopData?.shopinsta && (
                    <Link
                      href={shopData.shopinsta || ""}
                      className="group inline-flex h-10 w-10 flex-col items-center justify-center rounded-full bg-slate-100 px-5 hover:bg-gray-50"
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
                  {shopData?.shopmap && (
                    <Link
                      href={shopData.shopmap || ""}
                      className="group inline-flex h-10 w-10 flex-col items-center justify-center rounded-full bg-slate-100 px-5 hover:bg-gray-50"
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
                  {shopData?.shopphone && (
                    <Link
                      href={"tel:" + shopData.shopphone || ""}
                      className="group inline-flex h-10 w-10 flex-col items-center justify-center rounded-full bg-slate-100 px-5 hover:bg-gray-50"
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
              <div className="mt-4 flex items-center justify-center gap-2">
                <p className="text-xs">Privacy Policy </p>
                <p className="text-xs">Terms And Conditions</p>
              </div>
              <Link
                href="https://tosto.in"
                className="my-7 flex w-full items-center justify-center font-body3"
              >
                Made With <span className="ml-1 text-red-500">tosto.in</span>
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

const MenuIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 25 23"
    fill="none"
    className={`size-${size}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5 3.00001C10.4654 1.1908 7.77869 1 4.83333 1C3.48923 1 2.19899 1.2291 1 1.65014V19.7408C2.19899 19.3198 3.48923 19 4.83333 19C7.77869 19 10.4654 20.1908 12.5 22M12.5 3.00001C14.5346 1.19079 17.2213 1 20.1667 1C21.5108 1 22.801 1.2291 24 1.65014V19.7408C22.801 19.3198 21.8441 19 20.5 19C17.5546 19 14.5346 20.1908 12.5 22M12.5 3.00001V22"
      stroke="#0F172A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 6L16.1328 5.94686C17.6775 5.32898 19.3686 5.17372 21 5.5V5.5"
      stroke="#0F172A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 9L16.1328 8.94686C17.6775 8.32898 19.3686 8.17372 21 8.5V8.5"
      stroke="#0F172A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 12L16.1328 11.9469C17.6775 11.329 19.3686 11.1737 21 11.5V11.5"
      stroke="#0F172A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 15L16.1328 14.9469C17.6775 14.329 19.3686 14.1737 21 14.5V14.5"
      stroke="#0F172A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.87329 4.65396L5.97809 4.54461C6.26267 4.24765 6.73733 4.24765 7.02191 4.54461C8.18123 5.75433 8.35715 7.60221 7.44693 9.00896L7.22322 9.35469V12.9794V15.2857C7.22322 15.6802 6.90343 16 6.50894 16C6.075 16 5.72322 15.6482 5.72322 15.2143V12.9794V9.35469L5.43912 8.90197C4.59311 7.55382 4.77204 5.80309 5.87329 4.65396Z"
      stroke="#0F172A"
      strokeLinejoin="round"
    />
  </svg>
);

const CardIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    width={size}
    height={size}
    className={`size-${size}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
    />
  </svg>
);

const BottomElement = () => (
  <svg
    width="5997"
    height="825"
    viewBox="0 0 5997 825"
    fill="none"
    strokeWidth={1.5}
    xmlns="http://www.w3.org/2000/svg"
    className="relative bottom-0 right-0 z-50 h-full w-full"
  >
    <path
      d="M1098.63 219.461C1713.75 216.947 2301.2 515.668 2912.3 457.013C3245.26 424.753 3548.54 289.009 3853.84 174.213C4159.64 59.8356 4495.11 -37.364 4824.55 14.1685C5145.94 64.0252 5425.58 250.883 5752 267.641C5868.69 273.926 5995.43 259.262 6094.01 311.633C6219.25 377.829 6280.76 701.687 6237 819.835C6399.87 1258.49 5837.5 1025.55 5556.85 1084.2C5276.2 1142.86 4982.48 1129.45 4693.27 1143.69C4020.82 1176.79 3369.49 1360.3 2697.54 1402.61C1891.8 1453.31 1085.05 1300.39 277.804 1330.13C156.088 1334.74 32.8637 1343.12 -86.3374 1322.17C-205.538 1300.81 -322.728 1244.66 -373.526 1152.49C-458.526 999.57 -302.106 923.738 -209.562 819.835C-105.953 703.782 -3.34912 597.366 134.461 506.87C407.065 327.553 750.082 220.717 1098.63 219.461Z"
      fill="white"
    />
  </svg>
);
