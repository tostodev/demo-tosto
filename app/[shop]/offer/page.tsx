import React from "react";
import Link from "next/link";
import { Button, Spinner } from "@nextui-org/react";
import Qr from "@/components/qrcode/Qr";
import { PrizeData } from "@/type";
import { cookies } from "next/headers";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import Redeem from "@/components/Redeem";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function generateStaticParams() {
//   return [{ shop: "tokos" }];
// }



async function getShop(slug: string): Promise<PrizeData | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  try {
    const res = await fetch(`${API_URL}/user_prize_page`, {
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

    const offerData: PrizeData = await res.json();
    console.log(offerData);
    return offerData;
  } catch (error) {
    console.error("An error occurred while fetching the shop details:", error);
    return null; // Return null if there's an error in the fetch process
  }
}

export default async function page({ params }: { params: { shop: string } }) {
  const shop = params.shop;
  const offerData: PrizeData | null = await getShop(shop);

  console.log(offerData);

  if (!offerData) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Spinner color="danger" />
      </div>
    );
  }

  return (
    <div>
      <div className="min-w-lg min-h-screen w-full bg-white sm:flex sm:flex-col sm:items-center sm:justify-center">
        <div className="relative min-h-screen w-full bg-cover sm:max-w-lg sm:rounded-3xl xl:max-w-sm">
          <div className="relative z-50 flex h-full min-h-[62vh] flex-col items-center justify-start gap-5 bg-white px-6 pb-3 pt-3 sm:rounded-b-3xl sm:pt-10">
            <div className="flex w-full flex-col items-center justify-between gap-3">
              {offerData.prizeData.loyalty_status && (
                <h3 className="flex w-full items-center justify-start gap-2 rounded-2xl border px-4 py-1.5 font-body4 text-base font-semibold">
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
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>{" "}
                  Loyalty Point : {offerData.prizeData.loyalty_points}
                </h3>
              )}
              {offerData.prizeData.referral_status && (
                <h3 className="flex w-full items-center justify-start gap-2 rounded-2xl border px-4 py-1.5 font-body4 text-base font-semibold">
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
                      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                    />
                  </svg>
                  No of referral : {offerData.prizeData.referral_points}
                </h3>
              )}
            </div>

            <div className="mt-6 flex w-full flex-col items-center justify-center">
              <hr className="h-2 w-full"></hr>
              <h2 className="-mt-[1.5rem] flex w-fit justify-center bg-white px-3 pb-4 font-body4 text-xl font-medium">
                Offers & Rewards{" "}
              </h2>
              {offerData.offers.length === 0 && (
                <h3 className="py-6 text-center font-body4 text-sm">
                  No offers/reward available
                </h3>
              )}
              {offerData.offers.map((offer, index) => (
                <div
                  style={{ background: offerData.prizeData.shopcolor }}
                  className="ticket shadow-xs mt-2 w-full rounded-2xl border border-white"
                >
                  <div className="dashed-line"></div>
                  <div className="ticket flex flex-col items-center justify-start bg-yellow-50/[95%]">
                    <div className="flex w-full items-center justify-between gap-4 p-6">
                      <div className="flex flex-1 items-center justify-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6 min-w-6 text-yellow-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                          />
                        </svg>
                        <h3 className="font-body4 text-base font-semibold">
                          {offer.reward}{" "}
                          <p className="text-xs font-normal">
                            {offer.reward_description}
                          </p>
                        </h3>
                      </div>
                      <Redeem id={offerData.prizeData.userid} />
                    </div>
                    <div className="flex w-full items-center justify-center gap-4 px-6 py-3">
                      <div className="flex w-full flex-1 flex-col items-start justify-start font-body4">
                        <h2 className="text-sm font-medium">
                          Terms and Conditions
                        </h2>
                        <ul className="mt-1 pb-2 text-xs">
                          {offer.t_and_c.map((term, index) => (
                            <li className="pt-1" key={index}>
                              {term}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {offerData.prizeData.referral_status && (
              <div className="mt-6 flex w-full flex-col items-center justify-center">
                <hr className="h-2 w-full"></hr>
                <h2 className="-mt-[1.5rem] flex w-fit justify-center bg-white px-3 pb-6 font-body4 text-xl font-medium">
                  Refer and Eat
                </h2>

                <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-slate-50 p-6 font-body4">
                  <div className="flex items-center gap-4">
                    <h3 className="font-body4 text-xl font-normal">1</h3>
                    <h3 className="font-body4 text-sm font-medium">
                      Send Gift Card: Share a free gift card with friends.
                      They'll receive it instantly.
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="font-body4 text-xl font-normal">2</h3>
                    <h3 className="font-body4 text-sm font-medium">
                      Redeem Offer: Friends visit the shop, redeem the gift
                      card, and enjoy the offer.
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="font-body4 text-xl font-normal">3</h3>
                    <h3 className="font-body4 text-sm font-medium">
                      Earn Rewards: You get rewards automatically when friends
                      redeem the offer.
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {offerData.prizeData.referral_status && (
              <div
                style={{ background: offerData.prizeData.shopcolor }}
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
                      Refer a friend with a fresh lime gift and earn exciting
                      rewards.
                    </h3>
                  </div>
                  <div className="box-shadow w-full rounded-2xl border-t bg-white pb-6 pt-4 font-body4">
                    <div className="grid grid-cols-2 gap-4 px-6 text-center">
                      {offerData.prizeData.referral_prize.map(
                        (reward, index) => (
                          <>
                            <h4 className="text-base font-medium">
                              {reward.no_of_referral} Referral
                            </h4>
                            <p className="reward-text py-.05 rounded-full bg-orange-50 px-2 text-center text-sm">
                              {reward.reward}{" "}
                              <span className="gift-emoji">🎁</span>
                            </p>
                          </>
                        ),
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-4 px-10">
                      <Link
                        href="https://wa.me/?text=Demo%20referrsl"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border bg-[#e2ffe7] py-2 font-body4 text-sm font-medium text-green-600"
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          className="hero_consultation-icon1__VsMlj"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2ZM8.59339 7.30019L8.39232 7.30833C8.26293 7.31742 8.13607 7.34902 8.02057 7.40811C7.93392 7.45244 7.85348 7.51651 7.72709 7.63586C7.60774 7.74855 7.53857 7.84697 7.46569 7.94186C7.09599 8.4232 6.89729 9.01405 6.90098 9.62098C6.90299 10.1116 7.03043 10.5884 7.23169 11.0336C7.63982 11.9364 8.31288 12.8908 9.20194 13.7759C9.4155 13.9885 9.62473 14.2034 9.85034 14.402C10.9538 15.3736 12.2688 16.0742 13.6907 16.4482C13.6907 16.4482 14.2507 16.5342 14.2589 16.5347C14.4444 16.5447 14.6296 16.5313 14.8153 16.5218C15.1066 16.5068 15.391 16.428 15.6484 16.2909C15.8139 16.2028 15.8922 16.159 16.0311 16.0714C16.0311 16.0714 16.0737 16.0426 16.1559 15.9814C16.2909 15.8808 16.3743 15.81 16.4866 15.6934C16.5694 15.6074 16.6406 15.5058 16.6956 15.3913C16.7738 15.2281 16.8525 14.9166 16.8838 14.6579C16.9077 14.4603 16.9005 14.3523 16.8979 14.2854C16.8936 14.1778 16.8047 14.0671 16.7073 14.0201L16.1258 13.7587C16.1258 13.7587 15.2563 13.3803 14.7245 13.1377C14.6691 13.1124 14.6085 13.1007 14.5476 13.097C14.4142 13.0888 14.2647 13.1236 14.1696 13.2238C14.1646 13.2218 14.0984 13.279 13.3749 14.1555C13.335 14.2032 13.2415 14.3069 13.0798 14.2972C13.0554 14.2955 13.0311 14.292 13.0074 14.2858C12.9419 14.2685 12.8781 14.2457 12.8157 14.2193C12.692 14.1668 12.6486 14.1469 12.5641 14.1105C11.9868 13.8583 11.457 13.5209 10.9887 13.108C10.8631 12.9974 10.7463 12.8783 10.6259 12.7616C10.2057 12.3543 9.86169 11.9211 9.60577 11.4938C9.5918 11.4705 9.57027 11.4368 9.54708 11.3991C9.50521 11.331 9.45903 11.25 9.44455 11.1944C9.40738 11.0473 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.74939 10.663 9.86248 10.5183C9.97128 10.379 10.0652 10.2428 10.125 10.1457C10.2428 9.95633 10.2801 9.76062 10.2182 9.60963C9.93764 8.92565 9.64818 8.24536 9.34986 7.56894C9.29098 7.43545 9.11585 7.33846 8.95659 7.32007C8.90265 7.31384 8.84875 7.30758 8.79459 7.30402C8.66053 7.29748 8.5262 7.29892 8.39232 7.30833L8.59339 7.30019Z"></path>
                        </svg>
                        <span>Refer Now</span>
                      </Link>
                      {/* <button className="w-full">Refer Now</button> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
