"use client";
import { Menu, MenuItem, MenuApi } from "@/type";
import { useState, useEffect, useRef } from "react";
import * as React from "react";
import Loader from "@/components/layout/Loader";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, Input, Skeleton } from "@nextui-org/react";
import { supabase } from "@/utils/supabase/client";
import { ShopDataP } from "@/type";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import axios from "axios";

export default function Page({ params }: { params: { shop: string } }) {
  const Api_url = process.env.NEXT_PUBLIC_API_URL;
  const [menu, setMenu] = useState<Menu[]>([]);
  const [localShopData, setlocalShopData] = useState<ShopDataP>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openStates, setOpenStates] = useState<boolean[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  //const [localShopData.Colour, setlocalShopData.Colour] = useState<string>("");

  const handleScrollToSection = (section: string) => {
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
      setActiveSection(section);
    }
  };

  // const addVisit = async () => {
  //   try {
  //     const response = await axios.post(`${Api_url}/update_menu_visit`, {
  //       shop_slug: params.shop,
  //     });
  //     console.log(response.data, "response for menu count update");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const getMenu = async () => {
    const tokendata = await axios.post("/api/auth/token", {});
    const token = tokendata.data.token;
    try {
      const res = await fetch(`${Api_url}/get_menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shop_slug: "tosto"}),
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

      const menuData: MenuApi = await res.json();
      console.log(menuData, "menu data");
      setMenu(menuData?.menu_data);

      // setlocalShopData.Colour(menuData.color);
      setActiveSection(menuData.menu_data[0].heading);
      setOpenStates(new Array(menuData.menu_data.length).fill(true));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const [search, setSearch] = React.useState("");
  const filteredMenuData = menu
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  useEffect(() => {
    const handleScroll = () => {
      sectionRefs.current.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            setActiveSection(filteredMenuData[index].heading);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filteredMenuData]);

  const handleOpenChange = (index: number, isOpen: boolean) => {
    setOpenStates((prevState) => {
      const newState = [...prevState];
      newState[index] = isOpen;
      return newState;
    });
  };

  const getlocalShopData = async () => {
    const { data, error } = await supabase
      .from("Demo")
      .select("*")
      .eq("url_identifier", params.shop)
      .single();

    if (error) {
      console.error(error);
      return;
    }
    setlocalShopData(data);
  };
  useEffect(() => {
    getMenu();
    getlocalShopData();
  }, []);

  if (!localShopData) return <Loader />;

  return (
    <>
      <div className="w-full sm:flex sm:flex-col relative sm:items-center sm:justify-center">
        {!loading ? (
          <div
            style={{ borderColor: localShopData.Colour }}
            className="min-h-screen w-full max-w-lg bg-white sm:rounded-2xl"
          >
            <div className="top-0 w-full max-w-lg border-b-2 bg-[white] py-3">
              <div className="pl-5 relative sm:max-w-lg max-w-sm flex snap-x snap-mandatory justify-start gap-3 overflow-x-scroll scroll-smooth border-gray-200 font-body4 text-sm scrollbar-hide">
                {filteredMenuData.map((section, index) => (
                  <button
                    key={index}
                    style={{
                      backgroundColor:
                        activeSection === section.heading
                          ? localShopData.Colour
                          : "#e9e9e9",
                      borderColor:
                        activeSection === section.heading
                          ? localShopData.Colour
                          : "transparent",
                    }}
                    className={`whitespace-nowrap rounded-full border px-4 py-[.37rem] text-sm ${
                      activeSection === section.heading
                        ? "text-white"
                        : "text-black"
                    }`}
                    onClick={() => handleScrollToSection(section.heading)}
                  >
                    {section.heading}
                  </button>
                ))}
              </div>
            </div>
            <Input
              className="focous:border-gray-700 border-gray-500 px-5 pt-5 font-body4"
              placeholder="Search for a dish..."
              variant="bordered"
              radius="full"
              classNames={{
                input: "text-sm py-3",
              }}
              onChange={(e) => setSearch(e.target.value)}
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              }
            ></Input>
            {filteredMenuData.map((menu, index) => (
              <div
                id={menu.heading}
                key={index}
                ref={(el: any) => (sectionRefs.current[index] = el)}
                className="my-9 w-full px-6 font-body4"
              >
                <Collapsible
                  key={index}
                  open={openStates[index]}
                  onOpenChange={(isOpen) => handleOpenChange(index, isOpen)}
                >
                  <div className="flex w-full justify-between">
                    <h1 className="mb-3 font-body4 text-xl font-bold">
                      {menu.heading}
                    </h1>
                    <CollapsibleTrigger asChild>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={`h-6 w-6 ${
                          openStates[index] ? "" : "rotate-180"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="w-full space-y-8">
                    {menu.items.map((item, itemIndex) => (
                      <Drawer>
                        <DrawerTrigger asChild>
                          <button className="mt-5 flex w-full items-center justify-between gap-3 border-b-2 border-gray-200 pb-6 text-left">
                            <div
                              className={`flex flex-col gap-1 ${
                                item.img === "" ? "w-5/5" : "w-3/5"
                              }`}
                            >
                              <h2 className="text-lg font-semibold">
                                {item.title}
                              </h2>
                              <p className="font-bold text-gray-800">
                                ₹{item.price}
                              </p>
                              <p className="text-sm text-gray-400">
                                {item.description.length >
                                (item.img === "" ? 65 : 50)
                                  ? item.description.slice(
                                      0,
                                      item.img === "" ? 65 : 50
                                    ) + "..."
                                  : item.description}
                              </p>
                            </div>
                            {item.img === "" ? (
                              <></>
                            ) : (
                              <img
                                src={item.img}
                                className="mx-auto h-24 w-2/5 rounded-xl border-gray-300 object-cover"
                              ></img>
                            )}
                          </button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader className="gap-2.5 text-left font-body4">
                              {!(item.img === "") && (
                                <div className="mb-2 h-56 bg-gray-100">
                                  <img
                                    src={item.img}
                                    className="mx-auto h-full w-full rounded-xl border-gray-300 object-cover"
                                  />
                                </div>
                              )}
                              <DrawerTitle className="font-body1 font-bold">
                                {item.title}{" "}
                              </DrawerTitle>
                              <DrawerTitle className="font-body1 font-bold">
                                ₹{item.price}
                              </DrawerTitle>
                              <DrawerDescription className="text-sm text-gray-500">
                                {item.description}
                              </DrawerDescription>
                            </DrawerHeader>

                            <DrawerFooter>
                              {/* <Button>Submit</Button> */}
                              <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full p-6 pt-0">
            <button className="mt-5 flex w-full items-center justify-between gap-3 border-b-2 border-gray-200 pb-6 text-left">
              <div className={`flex w-3/5 flex-col gap-3`}>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-2 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="mx-auto h-20 w-2/5 rounded-xl border-gray-300 object-cover"></div>{" "}
              </Skeleton>{" "}
            </button>
            <button className="mt-5 flex w-full items-center justify-between gap-3 border-b-2 border-gray-200 pb-6 text-left">
              <div className={`flex w-3/5 flex-col gap-3`}>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-2 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="mx-auto h-20 w-2/5 rounded-xl border-gray-300 object-cover"></div>{" "}
              </Skeleton>{" "}
            </button>
            <button className="mt-5 flex w-full items-center justify-between gap-3 border-b-2 border-gray-200 pb-6 text-left">
              <div className={`flex w-3/5 flex-col gap-3`}>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-2 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="mx-auto h-20 w-2/5 rounded-xl border-gray-300 object-cover"></div>{" "}
              </Skeleton>{" "}
            </button>
            <button className="mt-5 flex w-full items-center justify-between gap-3 border-b-2 border-gray-200 pb-6 text-left">
              <div className={`flex w-3/5 flex-col gap-3`}>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-2 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="mx-auto h-20 w-2/5 rounded-xl border-gray-300 object-cover"></div>{" "}
              </Skeleton>{" "}
            </button>
            <button className="mt-5 flex w-full items-center justify-between gap-3 border-gray-200 pb-6 text-left">
              <div className={`flex w-3/5 flex-col gap-3`}>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-2 w-2/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-2 w-4/5 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="mx-auto h-20 w-2/5 rounded-xl border-gray-300 object-cover"></div>{" "}
              </Skeleton>{" "}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
