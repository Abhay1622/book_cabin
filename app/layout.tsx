import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel Booking App",
  description: "Find and book hotels easily",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body style={{backgroundColor: "#141C24"}} className={`${josefin.variable} antialiased `} >
        
        <Providers session={session}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
