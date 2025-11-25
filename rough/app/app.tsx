"use client";

import Home from "./page";
import { SessionProvider } from "next-auth/react";
export default  function App({ children }: { children: React.ReactNode }) {
    
    return <SessionProvider>{children}</SessionProvider>;
}