"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DatePicker, Skeleton, Switch } from "@nextui-org/react";
import { UserData } from "@/type";
import axios from "axios";
import debounce from "lodash/debounce";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { set } from "lodash";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function page({ params }: { params: { shop: string } }) {
  const shop = params.shop;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editedData, setEditedData] = useState<{ [key: string]: any }>({});
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<string | null>(null);
  const [name, setName] = useState<string>(""); // Provide a default value for name
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // useEffect(() => {
  //   async function fetchuserData() {
  //     try {
  //       const tokendata = await axios.post("/api/auth/token", {});
  //       const token = tokendata.data.token;
  //       setToken(token);
  //       const res = await fetch(`${API_URL}/profile_page`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ shop_slug: shop }),
  //       });

  //       if (!res.ok) {
  //         console.error(`HTTP error! status: ${res.status}`);
  //         return null; // Return null if the response is not ok
  //       }

  //       const contentType = res.headers.get("content-type");
  //       if (!contentType || !contentType.includes("application/json")) {
  //         console.error("Received non-JSON response from the server");
  //         return null; // Return null if the response is not JSON
  //       }

  //       const data = await res.json();
  //       setUserData(data);
  //     } catch (error) {
  //       console.error(
  //         "An error occurred while fetching the shop details:",
  //         error,
  //       );
  //     }
  //   }

  //   fetchuserData(); // Call the fetch function when the component mounts

  //   // Clean up function (optional)
  //   return () => {
  //     // Perform any cleanup here if needed
  //   };
  // }, [shop]);

  const editUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/edit_profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shop_slug: shop,
          username: name,
          useremail: email,
          birthday: birthday,
        }),
      });

      if (!res.ok) {
        console.error(`HTTP error! status: ${res.status}`);
        return null; // Return null if the response is not ok
      }

      onOpenChange();
    } catch (error) {
      console.error("An error occurred while editing the user data:", error);
    }
  };
  const editUserOfferData = async (name: string, value: boolean) => {
    try {
      const res = await fetch(`${API_URL}/profile_page/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shop_slug: shop,
          [name]: value, // Dynamically set the changed field and value
        }),
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

      const data = await res.json();
      console.log("User offer data updated successfully:", data);
    } catch (error) {
      console.error("An error occurred while editing the user data:", error);
    }
  };

  // if (!userData) {
  //   return (
  //     <div className="w-full space-y-6 p-6">
  //       <Skeleton className="h-64 w-full rounded-2xl"></Skeleton>
  //       <Skeleton className="h-64 w-full rounded-2xl"></Skeleton>
  //       <Skeleton className="h-32 w-full rounded-2xl"></Skeleton>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="min-w-lg min-h-screen w-full bg-white sm:flex sm:flex-col sm:items-center sm:justify-center">
        <div className="relative min-h-screen w-full bg-cover sm:max-w-lg sm:rounded-3xl xl:max-w-sm">
          <div className="relative z-50 flex h-full min-h-[62vh] flex-col items-center justify-start gap-5 bg-white px-6 pb-3 pt-3 sm:rounded-b-3xl sm:pt-10">
            <div className="flex w-full flex-col items-start justify-start rounded-2xl border p-6 font-body4">
              <div className="flex w-full items-center justify-between pb-5">
                <h2 className="flex items-center text-lg font-bold">Profile</h2>
                <button
                  onClick={() => {
                    onOpen();
                  }}
                  className="rounded-full bg-slate-200 px-4 py-1 text-xs"
                >
                  Edit
                </button>
              </div>
              <p className="flex w-full items-center justify-start gap-3 py-3 text-base font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Username
              </p>
              <p className="flex w-full items-center justify-start gap-3 border-t border-gray-200 py-3 text-base font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
                PhoneNumber{" "}
              </p>
              <p className="flex w-full items-center justify-start gap-3 border-t border-gray-200 py-3 text-base font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                  />
                </svg>
                Email
              </p>{" "}
              <p className="flex w-full items-center justify-start gap-3 border-t border-gray-200 py-3 text-base font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
                  />
                </svg>
                dd/mm/yyyy
              </p>
            </div>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="center"
              size="sm"
              className="mx-5 max-w-sm font-body1"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 font-body1">
                      Edit profile
                    </ModalHeader>
                    <ModalBody>
                      <div className="flex w-full flex-col gap-4">
                        <Input
                          variant="bordered"
                          label=" Full Name"
                          onChange={(event) => setName(event.target.value)}
                          className="font-body1"
                        />
                        <Input
                          variant="bordered"
                          label="Email"
                          onChange={(event) => setEmail(event.target.value)}
                          className="font-body1"
                        />{" "}
                        <DatePicker
                          onChange={(event: any) =>
                            setBirthday(event.target.value)
                          }
                          label={"Birth date"}
                          variant="bordered"
                        />
                        <Button
                          className="rounded-full px-6 font-body1"
                          onClick={editUserData}
                        >
                          Update
                        </Button>{" "}
                      </div>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            <div className="flex w-full flex-col items-start justify-start rounded-2xl border p-6 font-body4">
              <h2 className="pb-5 text-lg font-bold">Shop Info</h2>

              <p className="flex w-full items-center justify-start gap-3 py-3 text-base font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                  />
                </svg>
                Shop Name
              </p>
              <p className="flex w-full items-center justify-start gap-3 border-t border-gray-200 py-3 text-base font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
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

                Shop Location
              </p>
              <p className="flex w-full items-center justify-start gap-3 border-t border-gray-200 py-3 text-base font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>

                Shop Map
              </p>
              <div className="flex w-full items-center justify-start gap-2 border-t py-4">
                
                  <Link
                    href= "instagram.com"
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
               
                
                  <Link
                    href="instagram.com"
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
               
                  <Link
                    href={"#"}
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
                
              </div>
            </div>

            <div className="flex w-full flex-col items-start justify-start rounded-2xl border p-6 font-body4">
              <h2 className="pb-5 text-lg font-bold">Offers & Notification</h2>
              <div className="flex w-full justify-between">
                <p className="flex w-full items-center justify-start gap-3 py-3 text-base font-medium">
                  <svg
                    stroke="#000"
                    strokeWidth="1"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="hero_consultation-icon1__VsMlj size-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2ZM8.59339 7.30019L8.39232 7.30833C8.26293 7.31742 8.13607 7.34902 8.02057 7.40811C7.93392 7.45244 7.85348 7.51651 7.72709 7.63586C7.60774 7.74855 7.53857 7.84697 7.46569 7.94186C7.09599 8.4232 6.89729 9.01405 6.90098 9.62098C6.90299 10.1116 7.03043 10.5884 7.23169 11.0336C7.63982 11.9364 8.31288 12.8908 9.20194 13.7759C9.4155 13.9885 9.62473 14.2034 9.85034 14.402C10.9538 15.3736 12.2688 16.0742 13.6907 16.4482C13.6907 16.4482 14.2507 16.5342 14.2589 16.5347C14.4444 16.5447 14.6296 16.5313 14.8153 16.5218C15.1066 16.5068 15.391 16.428 15.6484 16.2909C15.8139 16.2028 15.8922 16.159 16.0311 16.0714C16.0311 16.0714 16.0737 16.0426 16.1559 15.9814C16.2909 15.8808 16.3743 15.81 16.4866 15.6934C16.5694 15.6074 16.6406 15.5058 16.6956 15.3913C16.7738 15.2281 16.8525 14.9166 16.8838 14.6579C16.9077 14.4603 16.9005 14.3523 16.8979 14.2854C16.8936 14.1778 16.8047 14.0671 16.7073 14.0201L16.1258 13.7587C16.1258 13.7587 15.2563 13.3803 14.7245 13.1377C14.6691 13.1124 14.6085 13.1007 14.5476 13.097C14.4142 13.0888 14.2647 13.1236 14.1696 13.2238C14.1646 13.2218 14.0984 13.279 13.3749 14.1555C13.335 14.2032 13.2415 14.3069 13.0798 14.2972C13.0554 14.2955 13.0311 14.292 13.0074 14.2858C12.9419 14.2685 12.8781 14.2457 12.8157 14.2193C12.692 14.1668 12.6486 14.1469 12.5641 14.1105C11.9868 13.8583 11.457 13.5209 10.9887 13.108C10.8631 12.9974 10.7463 12.8783 10.6259 12.7616C10.2057 12.3543 9.86169 11.9211 9.60577 11.4938C9.5918 11.4705 9.57027 11.4368 9.54708 11.3991C9.50521 11.331 9.45903 11.25 9.44455 11.1944C9.40738 11.0473 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.74939 10.663 9.86248 10.5183C9.97128 10.379 10.0652 10.2428 10.125 10.1457C10.2428 9.95633 10.2801 9.76062 10.2182 9.60963C9.93764 8.92565 9.64818 8.24536 9.34986 7.56894C9.29098 7.43545 9.11585 7.33846 8.95659 7.32007C8.90265 7.31384 8.84875 7.30758 8.79459 7.30402C8.66053 7.29748 8.5262 7.29892 8.39232 7.30833L8.59339 7.30019Z"></path>
                  </svg>
                  Whatsapp Notification
                </p>
                <Switch
                  name="whatsapp_notification"
                  isSelected={true}
                  size="sm"
                  // onChange={(value) =>
                  //   editUserOfferData("whatsapp_notification", value)
                  // }
                ></Switch>
              </div>{" "}
              <div className="flex w-full justify-between border-t border-gray-200">
                <p className="flex w-full items-center justify-start gap-3 py-3 text-base font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                    />
                  </svg>
                  Email Notification
                </p>
                <Switch
                  name="email_notification"
                  isSelected={true}
                  size="sm"
                  // onChange={(value) =>
                  //   editUserOfferData("email_notification", value)
                  // }
                ></Switch>
              </div>
              <div className="flex w-full justify-between border-t border-gray-200">
                <p className="flex w-full items-center justify-start gap-3 py-3 text-base font-medium">
                  <svg
                    stroke="#000"
                    strokeWidth="1"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="hero_consultation-icon1__VsMlj size-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2ZM8.59339 7.30019L8.39232 7.30833C8.26293 7.31742 8.13607 7.34902 8.02057 7.40811C7.93392 7.45244 7.85348 7.51651 7.72709 7.63586C7.60774 7.74855 7.53857 7.84697 7.46569 7.94186C7.09599 8.4232 6.89729 9.01405 6.90098 9.62098C6.90299 10.1116 7.03043 10.5884 7.23169 11.0336C7.63982 11.9364 8.31288 12.8908 9.20194 13.7759C9.4155 13.9885 9.62473 14.2034 9.85034 14.402C10.9538 15.3736 12.2688 16.0742 13.6907 16.4482C13.6907 16.4482 14.2507 16.5342 14.2589 16.5347C14.4444 16.5447 14.6296 16.5313 14.8153 16.5218C15.1066 16.5068 15.391 16.428 15.6484 16.2909C15.8139 16.2028 15.8922 16.159 16.0311 16.0714C16.0311 16.0714 16.0737 16.0426 16.1559 15.9814C16.2909 15.8808 16.3743 15.81 16.4866 15.6934C16.5694 15.6074 16.6406 15.5058 16.6956 15.3913C16.7738 15.2281 16.8525 14.9166 16.8838 14.6579C16.9077 14.4603 16.9005 14.3523 16.8979 14.2854C16.8936 14.1778 16.8047 14.0671 16.7073 14.0201L16.1258 13.7587C16.1258 13.7587 15.2563 13.3803 14.7245 13.1377C14.6691 13.1124 14.6085 13.1007 14.5476 13.097C14.4142 13.0888 14.2647 13.1236 14.1696 13.2238C14.1646 13.2218 14.0984 13.279 13.3749 14.1555C13.335 14.2032 13.2415 14.3069 13.0798 14.2972C13.0554 14.2955 13.0311 14.292 13.0074 14.2858C12.9419 14.2685 12.8781 14.2457 12.8157 14.2193C12.692 14.1668 12.6486 14.1469 12.5641 14.1105C11.9868 13.8583 11.457 13.5209 10.9887 13.108C10.8631 12.9974 10.7463 12.8783 10.6259 12.7616C10.2057 12.3543 9.86169 11.9211 9.60577 11.4938C9.5918 11.4705 9.57027 11.4368 9.54708 11.3991C9.50521 11.331 9.45903 11.25 9.44455 11.1944C9.40738 11.0473 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.74939 10.663 9.86248 10.5183C9.97128 10.379 10.0652 10.2428 10.125 10.1457C10.2428 9.95633 10.2801 9.76062 10.2182 9.60963C9.93764 8.92565 9.64818 8.24536 9.34986 7.56894C9.29098 7.43545 9.11585 7.33846 8.95659 7.32007C8.90265 7.31384 8.84875 7.30758 8.79459 7.30402C8.66053 7.29748 8.5262 7.29892 8.39232 7.30833L8.59339 7.30019Z"></path>
                  </svg>
                  Whatsapp Offers
                </p>
                <Switch
                  name="whatsapp_offers"
                  // isSelected={userData.profileDetails.whatsapp_offers}
                  size="sm"
                  onChange={
                    (value) => console.log(value)
                    // editUserOfferData("whatsapp_offers", value)
                  }
                ></Switch>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
