"use client"; // This is a client component 👈🏽

import { GameContainer } from "@/components/game";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);
  return <GameContainer />;
}
