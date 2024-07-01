import React from "react";
import { Spinner } from "@nextui-org/react";

export default function Loader() {
  return (
    <>
      <div className="h-screen w-screen fixed flex justify-center items-center">
        <Spinner color="danger" />
      </div>
    </>
  );
}
