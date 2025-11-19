import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";
import { Mulish } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";

const mulish = Mulish({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recommender systems",
  description: "Overview and differences between recommender systems",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className={mulish.className}>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background antialiased"
        )}
      >
        <Providers>
          <Navbar />
          <div className="container mx-auto">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
