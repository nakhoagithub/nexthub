"use client";

import store, { StoreApp } from "@/store/store";
import React, { createContext } from "react";
import { StoreApi, UseBoundStore } from "zustand";

export const StoreContext = createContext<StoreApi<StoreApp>>(store);

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export default ContextProvider;
