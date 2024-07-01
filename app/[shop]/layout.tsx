import BottomBar from "@/components/layout/BottomBar";
import MenuBarMobile from "@/components/sidebar/MenuMobile";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Login from "@/components/Login";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { ShopDataP } from "@/type";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
type ShopMeta = {
  shopname: string;
  shoplogo: string;
  shop_color: string;
  shop_insta: string;
  shop_map: string;
  shop_phone: string;
  shopplace: string;
  shopcode: string;
  loyalty_status: boolean;
  menu: boolean;
};

const codes: { [key: string]: string } = {
  A: "​",
  B: "‍",
  C: "‎",
};

function calculateTotalCode(clientcode: string | undefined): string {
  if (!clientcode) {
    return "";
  }

  let total = "";
  for (let i = 0; i < clientcode.length; i++) {
    total += codes[clientcode[i]] || "";
  }
  return total;
}
export const revalidate = 600;

async function getShop(slug: string): Promise<ShopMeta | null> {
  try {
    const res = await fetch(`${API_URL}/shop_metatag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shop_slug: slug }),
    });

    // if (!res.ok) {
    //   notFound(); // Show 404 page if shop is not found
    // }

    const text = await res.text();
    try {
      const shop: ShopMeta = JSON.parse(text);
      return shop;
    } catch (jsonError) {
      console.error(`Failed to parse JSON: `);
      return null;
    }
  } catch (error) {
    // notFound(); // Show 404 page if shop is not found

    console.error("Failed to fetch shop data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { shop: string };
}): Promise<Metadata> {
  const shop: ShopMeta | null = await getShop(params.shop);

  if (!shop) {
    // Provide default metadata in case shop data is not available
    const defaultTitle = "Shop Not Found";
    const defaultDescription =
      "The shop you are looking for could not be found.";

    return {
      title: defaultTitle,
      description: defaultDescription,
      openGraph: {
        title: defaultTitle,
        description: defaultDescription,
        images: [],
      },
    };
  }

  const title = `${shop.shopname}`;
  const description = `Know more about ${shop.shopname}.`;

  const metadata = {
    image: shop.shoplogo,
    url: `https://tosto.in/${params.shop}`,
    robots: "all",
    googlebot: "index,follow",
    mobileWebAppCapable: "yes",
    appleMobileWebAppCapable: "yes",
    msApplicationStartUrl: "/",
    applicationName: shop.shopname,
    appleMobileWebAppTitle: shop.shopname,
    appleMobileWebAppStatusBarStyle: "default",
    msApplicationTileColor: shop.shop_color,
    msApplicationTapHighlight: "no",
    twitterCard: "summary",
    twitterTitle: shop.shopname,
    twitterDescription: `Know more about ${shop.shopname}.`,
    twitterImage: shop.shoplogo,
    appleTouchIcon: shop.shoplogo,
    favicon: shop.shoplogo,
    Shortcut_icon: shop.shoplogo,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [shop.shoplogo],
    },
    ...metadata,
  };
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

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { shop: string };
}) {
  const shop: ShopMeta | null = await getShop(params.shop);
  const LocalShop: ShopDataP | null = await getLocalShopData(params.shop);
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const shops = cookieStore.get("shops")?.value;

  let login = false;
  let shopArray = [];
  console.log(shops, "shops");

  if (token) {
    if (shops) {
      try {
        shopArray = JSON.parse(shops); // Assuming shops is a JSON string
        if (!Array.isArray(shopArray)) {
          shopArray = [];
        }
      } catch (error) {
        console.error("Failed to parse shops cookie:", error);
        shopArray = [];
      }

      // if (!shopArray.includes(params.shop)) {
      //   login = true;
      // }
    }
  }
  console.log(shopArray, "aarara");
  const code = calculateTotalCode(shop?.shopcode);
  const redirect_link = `whatsapp://send?phone=919037106287&text=${encodeURIComponent(
    `‎${code}Send this message to start demo for, ${params.shop}`
  )}`;

  if (!token) {
    redirect(redirect_link);
  }
  if (!LocalShop) {
    return <div>Loading...</div>;
  }
  return (
    <section className="flex min-h-screen justify-center bg-white">
      <div
        className="min-w-lg rounded-3xl sm:max-w-lg sm:border xl:max-w-sm"
        style={{ borderColor: LocalShop.Colour }}
      >
        <div
          className="min-w-lg relative isolate z-10 flex flex-col items-center justify-center sm:rounded-3xl"
          style={{ background: LocalShop.Colour }}
        >
          <div className="min-w-xl obejct-cover min-w-7xl absolute inset-0 bg-[url(https://hyperlaneacademy.vercel.app/noise.png)] bg-cover opacity-60 sm:rounded-3xl"></div>
          <div className="obejct-cover min-w-7xl absolute inset-0 z-0 w-full bg-gradient-to-b from-transparent to-[#ffffff90] bg-cover opacity-50"></div>
          <nav className="z-50 mt-1 flex w-full items-center justify-between px-6 pb-3 pt-6">
            <div className="flex items-center justify-center gap-2">
              <img
                src={LocalShop.Logo}
                className="h-12 rounded-full border border-white object-cover"
              />
              <h1 className="text-center font-body4 text-xl font-bold capitalize text-white">
                {LocalShop.ShopName}{" "}
              </h1>
            </div>{" "}
            <MenuBarMobile />
          </nav>
          <BottomElement />
        </div>
        {login ? (
          <Login
            name={LocalShop.ShopName || ""}
            token={token}
            slug={"tosto"}
            shops={shopArray}
          />
        ) : (
          children
        )}

        <footer className="z-40 flex w-full flex-col justify-start p-6 pb-16 font-body4">
          <div className="flex w-full justify-between border-b border-t py-4">
            <div>
              <h3 className="text-lg font-bold">{LocalShop.ShopName}</h3>
              <p>{LocalShop.ShopLocation}</p>
            </div>{" "}
            <div className="flex items-center justify-center gap-2">
              {shop?.shop_insta && (
                <Link
                  href={shop.shop_insta || ""}
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
              {LocalShop.ShopLocation && (
                <Link
                  href={shop?.shop_map || ""}
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
              {shop?.shop_phone && (
                <Link
                  href={"tel:" + shop.shop_phone || ""}
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
        <BottomBar
          menu={true}
          loyalty={shop?.loyalty_status ?? false}
          slug={params.shop}
          shopColor={LocalShop.Colour ?? ""}
        />
      </div>
    </section>
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
    className="relative bottom-0 right-0 z-50 -mb-0.5 h-full w-full"
  >
    <path
      d="M1098.63 219.461C1713.75 216.947 2301.2 515.668 2912.3 457.013C3245.26 424.753 3548.54 289.009 3853.84 174.213C4159.64 59.8356 4495.11 -37.364 4824.55 14.1685C5145.94 64.0252 5425.58 250.883 5752 267.641C5868.69 273.926 5995.43 259.262 6094.01 311.633C6219.25 377.829 6280.76 701.687 6237 819.835C6399.87 1258.49 5837.5 1025.55 5556.85 1084.2C5276.2 1142.86 4982.48 1129.45 4693.27 1143.69C4020.82 1176.79 3369.49 1360.3 2697.54 1402.61C1891.8 1453.31 1085.05 1300.39 277.804 1330.13C156.088 1334.74 32.8637 1343.12 -86.3374 1322.17C-205.538 1300.81 -322.728 1244.66 -373.526 1152.49C-458.526 999.57 -302.106 923.738 -209.562 819.835C-105.953 703.782 -3.34912 597.366 134.461 506.87C407.065 327.553 750.082 220.717 1098.63 219.461Z"
      fill="white"
    />
  </svg>
);
