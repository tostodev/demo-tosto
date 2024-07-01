"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import Qr from "./qrcode/Qr";

export default function Redeem(id: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        onClick={() => {
          onOpen();
        }}
        className="flex gap-0.5 font-body4 text-xs border px-4 py-1 bg-white rounded-full justify-center items-center"
      >
        Redeem
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        size="sm"
        className=" max-w-sm mx-5  font-body1"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex font-body1 flex-col gap-1">
                Redeem Prize
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 w-full">
                  <div className="bg-white bg border  p-3 flex  items-center flex-col font-body4 rounded-2xl mt-[.1rem] w-full">
                    <Qr text={id} size={160} />
                    <p className="mt-1 mb-1 font-semibold text-sm">
                      Show This QR to Cashier
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
