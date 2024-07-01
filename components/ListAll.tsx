"use client";
import React from "react";
import { ShopData } from "@/type";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
interface ListAllProps {
  shops: ShopData[];
}
export default function ListAll({ shops }: ListAllProps) {
  return (
    <>
      <Table className=" w-[70%] border border-gray-400 p-4 m-4 mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ShopName</TableHead>
            <TableHead className="text-right">URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops.map((shop) => (
            <TableRow key={shop.url_identifier} className="">
              <TableCell>{shop.ShopName}</TableCell>
              <TableCell className=" text-right  underline cursor-pointer text-blue-700 font-semibold">
                <Link href={`/${shop.url_identifier}`} passHref>
                  {shop.url_identifier}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
