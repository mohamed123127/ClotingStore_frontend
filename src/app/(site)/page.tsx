// 'use client'
import Home from "@/components/Home";
import { Metadata } from "next";
import { useEffect } from "react";
import ShopWithSidebarPage from "./(pages)/shop-with-sidebar/page";


export const metadata: Metadata = {
  title: "Jardin d'enfant - Boutique enline",
  description: "Jardin d'enfant est un Boutique enline pour vent des vetement pour enfant",
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
