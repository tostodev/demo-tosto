"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ListAll from "@/components/ListAll";
import withAuth from "@/AuthWrapper";

function Component() {
  interface ShopDataT {
    ShopName: string;
    ShopLocation?: string;
    Logo?: string;
    Colour?: string;
    url_identifier: string;
  }
  const [add, setAdd] = useState<string>("upload");
  const [urlIdentifiers, setUrlIdentifiers] = useState<string[]>([]);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [allShops, setAllShops] = useState<ShopDataT[]>([]);

  const [shopData, setShopData] = useState<ShopDataT>({
    ShopName: "",
    ShopLocation: "",
    Logo: "",
    Colour: "",
    url_identifier: "",
  });

  const handleSubmit = async () => {
    if (
      !shopData.ShopName ||
      !shopData.url_identifier ||
      !shopData.Logo ||
      !shopData.Colour ||
      !shopData.ShopLocation
    ) {
      alert("Stuff missing");
      return;
    }
    const { data, error } = await supabase
      .from("Demo")
      .insert([shopData])
      .select();
    if (data) {
      alert("Shop added successfully");
      fetchShops();
      console.log(data, "data");
    }
    if (error) {
      alert("Error adding shop");
      console.error("Error:", error);
    }
  };

  const handleUploadClick = async (file: File) => {
    if (file) {
      const get_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;
      setAdd("uploading");
      const rand = Math.floor(Math.random() * 1000000000);
      const filename = `demo_stuff/${rand}_${file.name}`;
      console.log(filename, "filename");
      const { data, error } = await supabase.storage
        .from("DemoBucket")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (data) {
        setShopData({
          ...shopData,
          Logo: `${get_url}DemoBucket/${data.path}`,
        });
        setAdd("uploaded");
        console.log(data, "data");
      }
      if (error) {
        console.error("Error:", error);
        setAdd("upload");
      }
    }
  };
  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const image = new Image();

      image.onload = async () => {
        const isSquare = image.width === image.height;
        console.log(isSquare, "isSquare");
        if (isSquare) {
          handleUploadClick(selectedFile);
        } else {
          alert("Image must be square.");
        }
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          image.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const fetchShops = async () => {
    const { data, error } = await supabase
      .from("Demo")
      .select("ShopName, url_identifier");
    if (data) {
      setAllShops(data);
      const urls = data.map((shop: ShopDataT) => shop.url_identifier);
      setUrlIdentifiers(urls);
    }
    if (error) {
      console.error("Error:", error);
    }
  };
  const checkUsername = (e: string) => {
    if (urlIdentifiers.includes(e)) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  console.log(shopData, "shopData");
  return (
    <>
      <div className=" flex flex-col sm:flex-row">
        <div className="container  sm:w-1/2 px-4 py-8 mx-auto">
          <div className="grid grid-cols-1 p-4 m-4 border border-gray-400 gap-6 sm:grid-cols-1 lg:grid-cols-1">
            <div className="space-y-2  w-[80%]">
              <Label htmlFor="name">Shop Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Shop name"
                onChange={(e) => {
                  setShopData({ ...shopData, ShopName: e.target.value });
                }}
              />
            </div>
            <div className="space-y-2 w-[80%]">
              <Label htmlFor="email">Shop Location</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => {
                  setShopData({ ...shopData, ShopLocation: e.target.value });
                }}
              />
            </div>
            <div className=" space-y-2 w-[80%]">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                onChange={(e) => {
                  setShopData({ ...shopData, url_identifier: e.target.value });
                  checkUsername(e.target.value);
                }}
              />
              {usernameError && (
                <p className="text-red-500 text-sm">Username already exists</p>
              )}
            </div>
            <div className="space-y-2 w-fit">
              <Label htmlFor="avatar">Profile Pic</Label>
              <Input id="avatar" type="file" onChange={handleFileInputChange} />
            </div>
            <div className="space-y-2 w-fit">
              <Label htmlFor="color">Accent Color</Label>
              <Input
                id="color"
                type="color"
                onChange={(e) => {
                  setShopData({ ...shopData, Colour: e.target.value });
                }}
              />
            </div>
            <div className="flex justify-center">
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </div>
        <div className="container  sm:w-1/2 px-4 py-8">
          <ListAll shops={allShops} />
        </div>
      </div>
    </>
  );
}

export default withAuth(Component);
