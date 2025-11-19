"use client";

import { TitlesResponse } from "@/types/movies";
import { createContext, ReactNode, useContext } from "react";

type TitlesContextType = TitlesResponse[];

const TitlesContext = createContext<TitlesContextType | undefined>(undefined);

export const TitlesProvider = ({
  children,
  initialTitles,
}: {
  children: ReactNode;
  initialTitles: TitlesContextType;
}) => {
  return (
    <>
      <TitlesContext.Provider value={initialTitles}>
        {children}
      </TitlesContext.Provider>
    </>
  );
};

export const useTitles = () => {
  const context = useContext(TitlesContext);
  if (!context) {
    throw new Error("useTitles must be used within a TitlesProvider");
  }
  return context;
};
