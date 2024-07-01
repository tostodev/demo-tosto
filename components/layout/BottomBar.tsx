"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import path from "path";

interface Page {
  name: string;
  path: string;
  icon: (props: { size: number }) => React.ReactElement;
}
const pages: Page[] = [
  { name: "home", path: "", icon: HomeIcon },
  { name: "menu", path: "menu", icon: MenuIcon },
  { name: "loyalty", path: "loyalty", icon: LoyaltyIcon },
  { name: "offer", path: "offer", icon: OfferIcon },
  { name: "profile", path: "profile", icon: ProfileIcon },
];

function MenuIcon({ size }: { size: number }) {
  return (
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
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 6L16.1328 5.94686C17.6775 5.32898 19.3686 5.17372 21 5.5V5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 9L16.1328 8.94686C17.6775 8.32898 19.3686 8.17372 21 8.5V8.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 12L16.1328 11.9469C17.6775 11.329 19.3686 11.1737 21 11.5V11.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 15L16.1328 14.9469C17.6775 14.329 19.3686 14.1737 21 14.5V14.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.87329 4.65396L5.97809 4.54461C6.26267 4.24765 6.73733 4.24765 7.02191 4.54461C8.18123 5.75433 8.35715 7.60221 7.44693 9.00896L7.22322 9.35469V12.9794V15.2857C7.22322 15.6802 6.90343 16 6.50894 16C6.075 16 5.72322 15.6482 5.72322 15.2143V12.9794V9.35469L5.43912 8.90197C4.59311 7.55382 4.77204 5.80309 5.87329 4.65396Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function HomeIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`size-${size}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function OfferIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`size-${size}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  );
}
function ProfileIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`size-${size}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}
function LoyaltyIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`size-${size}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

// Define other icons similarly

export default function BottomBar({
  slug,
  shopColor,
  menu,
  loyalty,
}: {
  slug: string;
  shopColor: string;
  menu: boolean;
  loyalty: boolean;
}) {
  const pathname = usePathname();
  let currentPage = null;

  if (pathname === "/" + slug) {
    currentPage = pages.find((page) => page.path === "");
  } else {
    currentPage = pages.find((page) => {
      if (page.path === "") {
        return pathname === "/";
      } else {
        return pathname.includes(page.path);
      }
    });
  }
   const filteredPages = pages.filter((page) => {
     if (page.name === "menu" && !menu) return false;
     if (page.name === "loyalty" && !loyalty) return false;
     return true;
   });
  
  const isSelected = currentPage !== null;
  return (
    <footer className="fixed z-50 w-full bg-gradient-to-t from-white via-white/70 to-transparent flex justify-center items-center -translate-x-1/2 bottom-0 pb-3 left-1/2">
      <div className="h-full gap-3 flex rounded-full">
        {filteredPages.map((page) => (
          <Link
            key={page.name}
            href={`/${slug}/${page.path}`}
            className={`inline-flex h-14 bg-slate-200 w-14 flex-col items-center justify-center px-5 rounded-full hover:bg-gray-50 group`}
            style={{
              backgroundColor:
                isSelected && currentPage?.name === page.name ? shopColor : "",
            }}
          >
            <div
              className={
                isSelected && currentPage?.name === page.name
                  ? "text-white"
                  : ""
              }
            >
              <page.icon size={6} />
            </div>
          </Link>
        ))}
      </div>
    </footer>
  );
}
