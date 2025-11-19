"use client";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider>
      {/* {children} */}
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
      >
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
