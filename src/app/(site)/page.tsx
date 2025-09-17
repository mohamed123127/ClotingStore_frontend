// 'use client'
import Home from "@/components/Home";
import { Metadata } from "next";
import { useEffect } from "react";
import ShopWithSidebarPage from "./(pages)/shop-with-sidebar/page";


export const metadata: Metadata = {
  title: "NextCommerce | Nextjs E-commerce template",
  description: "This is Home for NextCommerce Template",
  // other metadata
};


export default function HomePage() {
  return (
    <>
      {/* <Home /> */}
      <ShopWithSidebarPage />
    </>
  );
}
