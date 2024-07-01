"use client";
import React, { useState, useEffect } from "react";
import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import { Button, Spinner } from "@nextui-org/react";
import Image from "next/image";

interface QRProps {
  text: string;
  size: number;
}

export default function QR(props: QRProps) {
  const { text } = props;
  const [qrImage, setQRImage] = useState("");
  const size = props.size || 16;
  useEffect(() => {
    async function generateQRCode() {
      try {
        const qrText = `${text}`; // Create a URL from the text

        const defaultOptions: QRCodeToDataURLOptions = {
          width: 800,
          margin: 2,
          color: {
            dark: "#000000ff",
            light: "#FFFFFFFF",
          },
        };

        const qrDataURL = await QRCode.toDataURL(qrText, defaultOptions); // Generate QR code in Data URL format

        setQRImage(qrDataURL);
      } catch (error) {
        console.error("Error generating QR code:");
      }
    }

    generateQRCode();
  }, [text]);
  const downloadQRCode = () => {
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = "qr_code.png";
    a.click();
  };

  return (
    <div>
      {qrImage ? (
        <>
          <Image width={size} height={size} src={qrImage} alt="QR Code" />
        </>
      ) : (
        <div className="flex justify-center items-center w-full h-full py-9">
          <Spinner />
        </div>
      )}
    </div>
  );
}
