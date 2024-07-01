"use client";
import React, { useState } from "react";
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

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: "🍔 Flavor Fiesta!",
    description: "Every bite brings you closer to delicious rewards!",
    time: "15m ago",
    icon: "🎉",
    color: "#FFD700",
  },
  {
    name: "Invite Your Pals!",
    description: "Share the joy of good food and great times with friends!",
    time: "10m ago",
    icon: "👯",
    color: "#FF6347",
  },

  {
    name: "📝 We Love Your Feedback!",
    description: "Share your thoughts and earn some extra love from us!",
    time: "1m ago",
    icon: "💬",
    color: "#1E90FF",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const MenuBarMobile: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar((prevState) => !prevState);
  };

  const ModalOverlay = () => (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-50 bg-black/50"
      onClick={toggleSidebar}
      style={{ zIndex: 999 }}
    />
  );

  const sidebarClassName = `bg-black w-[250px] transition-[margin-left] ease-in-out duration-500 fixed top-0 bottom-0 left-0 z-50 ${
    showSidebar ? "ml-0" : "-ml-[250px]"
  }`;

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="z-50 flex flex-col gap-2">
          <div className="h-[0.14rem] w-8 bg-white" />
          <div className="h-[0.15rem] w-12 bg-white" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-80 min-h-80 p-7">
        <AnimatedList>
          {notifications.map((item, idx) => (
            <Notification {...item} key={idx} />
          ))}
        </AnimatedList>
        <DrawerFooter>
          <DrawerClose></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuBarMobile;

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3 font-body4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="flex w-full items-center justify-center px-3 text-xl">
            {icon}
          </span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};
