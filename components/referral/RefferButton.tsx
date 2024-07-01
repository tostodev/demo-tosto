"use client";

import React, { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
// import { Spinner } from "@nextui-org/react";

interface MyComponentProps {
  logoImageUrl: string;
  shopColor: string;
  cafeName: string;
  cafeLocation: string;
  senderName: string;
  giftName: string;
}
export default function RefferButton({
  logoImageUrl,
  shopColor,
  cafeLocation,
  cafeName,
  senderName,
  giftName,
}: MyComponentProps) {
  function hexToRgb(hex: string): [number, number, number] | null {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, "");

    // Parse the hex string
    let bigint = parseInt(hex, 16);

    if (isNaN(bigint)) {
      // Return null if the string is not a valid hex code
      return null;
    }

    // Extract the red, green, and blue components
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
  }

  // Function to convert HSV to RGB
  function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    if (r === undefined || g === undefined || b === undefined) {
      return [0, 0, 0];
    }
    return [r * 255, g * 255, b * 255];
  }

  // Function to adjust hue of an image
  function adjustHue(
    imageData: ImageData,
    ctx: CanvasRenderingContext2D,
    color1: [number, number, number],
    color2: [number, number, number],
  ): void {
    const data = imageData.data;
    const hueDelta = calculateHueDelta(
      color1[0],
      color1[1],
      color1[2],
      color2[0],
      color2[1],
      color2[2],
    );

    for (let i = 0; i < data.length; i += 4) {
      // Convert RGB to HSV
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const [h, s, v] = rgbToHsv(r, g, b);

      // Adjust hue
      let newHue = (h + hueDelta) % 1;
      if (newHue < 0) {
        newHue += 1;
      }

      // Convert back to RGB
      const [newR, newG, newB] = hsvToRgb(newHue, s, v);

      // Update pixel data
      data[i] = newR;
      data[i + 1] = newG;
      data[i + 2] = newB;
    }

    // Put modified image data back to canvas
    ctx.putImageData(imageData, 0, 0);
  }

  // Function to calculate hue difference between two RGB colors
  function calculateHueDelta(
    r1: number,
    g1: number,
    b1: number,
    r2: number,
    g2: number,
    b2: number,
  ): number {
    const [h1, s1, v1] = rgbToHsv(r1, g1, b1);
    const [h2, s2, v2] = rgbToHsv(r2, g2, b2);

    // Calculate hue difference
    let hueDelta = h2 - h1;
    if (hueDelta < 0) {
      hueDelta += 1; // Ensure hueDelta is within [0, 1)
    }

    return hueDelta;
  }

  // Function to convert RGB to HSV (Hue, Saturation, Value)
  function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
    (r /= 255), (g /= 255), (b /= 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      if (h !== undefined) h /= 6;
    }
    if (h === undefined) {
      h = 0;
    }
    return [h, s, v];
  }

  const [loading, setLoading] = useState(false);
  const [finalFile, setFinalFile] = useState<File | null>(null); // File to be shared
  const handleFile = async () => {
    setLoading(true);
    const backgroundImageUrl =
      "https://qxzqzjyzzqhimoqjomhj.supabase.co/storage/v1/object/public/resto_bucket/resources/template-referaal_small.png"; // Replace with your image URL
    // const logoImageUrl =
    //   "https://qxzqzjyzzqhimoqjomhj.supabase.co/storage/v1/object/public/resto_bucket/shop_logo/4e8fd076-d8b9-4d87-a28a-bedb541eeacc"; // Replace with your icon image URL

    try {
      // Load the background image
      const response = await fetch(backgroundImageUrl);
      const blob = await response.blob();

      // Create an image element and load the blob
      const image = new Image();
      image.src = URL.createObjectURL(blob);

      image.onload = async () => {
        // Create a canvas and draw the background image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error("Failed to get 2d context from canvas");
          return;
        }
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        // Get image data and modify it (replace white pixels with black)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const rgb1 = hexToRgb(shopColor);
        if (!rgb1) {
          console.error("Invalid color code");
          alert(
            "Sorry invalid color code ( please contact support, its a bug)",
          );
          return;
        }
        const rgb2: [number, number, number] = [98, 43, 52];

        adjustHue(imageData, ctx, rgb1, rgb2);
        ctx.putImageData(imageData, 0, 0);

        // Set text properties
        const fontSize = 55;
        ctx.font = `490 ${fontSize}px Poppins, Arial`; // Use Poppins or fallback to Arial
        ctx.fillStyle = shopColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Calculate text position
        const x = canvas.width / 2;
        const y = canvas.height / 2;

        const text = "🎉 Congrats 🎉";

        ctx.fillText(text, x, y);

        ctx.font = `500 56px Poppins, Arial`; // Use Poppins or fallback to Arial
        ctx.fillStyle = "#ffffff";
        const titleY = 280;
        ctx.fillText(cafeName, x, 290);

        ctx.font = `390 35px Poppins, Arial`; // Use Poppins or fallback to Arial
        ctx.fillText(cafeLocation, x, titleY + 60);

        // const senderName = "anand";
        ctx.fillStyle = shopColor;
        const senderNameY = 720;
        const msg = `${senderName} gifted you`;
        ctx.font = `360 43px Poppins, Arial`; // Use Poppins or fallback to Arial
        ctx.fillText(msg, x, senderNameY);

        ctx.font = `470 72px Poppins, Arial`; // Use Poppins or fallback to Arial
        ctx.fillText(giftName, x, senderNameY + 70);

        const footer1 = "Click the link to redeem the offer";
        const footer2 = "Terms & Conditions Apply";
        ctx.fillStyle = "black";
        ctx.font = `420 23px Poppins, Arial`; // Use Poppins or fallback to Arial
        ctx.fillText(footer1, x, canvas.height - 100);
        ctx.font = `420 20px Poppins, Arial`; // Use Poppins or fallback to Arial
        ctx.fillText(footer2, x, canvas.height - 60);

        // Load the square logo image
        const logoResponse = await fetch(logoImageUrl);
        const logoBlob = await logoResponse.blob();

        // Create an image element for the logo and load the blob
        const logoImage = new Image();
        logoImage.src = URL.createObjectURL(logoBlob);

        logoImage.onload = () => {
          // Define the radius of the circular clip path
          const radius = 70; // Adjust size as needed
          const centerX = canvas.width / 2;
          const centerY = 170; // Adjust vertical position

          // Draw circular clipping path
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          // Draw the square logo image inside the circular clipping path
          const logoSize = radius * 2;
          const logoX = centerX - radius;
          const logoY = centerY - radius;
          ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

          // convert blob to url
         

          // Convert canvas to data URL and set state to display the image
          canvas.toBlob(async (canvasBlob) => {
            if (!canvasBlob) {
              console.error("Failed to convert canvas to blob");
              return;
            }
            const file = new File([canvasBlob], "referral.png", {
              type: "image/png",
            });
            setFinalFile(file);
            setLoading(false);
          }, "image/png");
        };
      };
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const handleSharing = async () => {
    if (navigator.share && finalFile) {
      try {
        console.log("Web share API is supported in your browser");
        await navigator.share({
          text: "text",
          title: "title",
          url: "https://tosto.in",
          files: [finalFile],
        });
        setLoading(false);

        console.log("Hooray! Your content was shared to the world");
      } catch (error) {
        console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      // fallback code
      console.log(
        "Web share is currently not supported on this browser. Please provide a callback",
      );
    }
  };

  useEffect(() => {
    if (
      logoImageUrl &&
      shopColor &&
      cafeName &&
      cafeLocation &&
      senderName &&
      giftName &&
      finalFile === null
    )
      handleFile();
  }, []);

  return (
    <div className="w-full">

      <Button
        onClick={handleSharing}
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
        Refer Now
        {/* {loading && (
          <Spinner size="sm" color="primary" style={{ marginLeft: "10px" }} />
        )} */}
      </Button>
    </div>
  );
}
