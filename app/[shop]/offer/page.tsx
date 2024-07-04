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
import RefferButton from "@/components/referral/RefferButton";
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
  const offerData: PrizeData | null = await getShop("tosto");

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
                  No of referral : 4
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
                        logoImageUrl={offerData.prizeData.shoplogo}
                        shopColor={offerData.prizeData.shopcolor}
                        cafeName={offerData.prizeData.shopname}
                        cafeLocation={offerData.prizeData.shopplace}
                        giftName={offerData.prizeData.arrival_reward}
                        senderName={offerData.prizeData.username}
                        clientdb_id={offerData.prizeData.clientdb_id}
                        userdb_id={offerData.prizeData.userdb_id}
                      />

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
