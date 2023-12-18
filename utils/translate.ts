"use client";
import { StoreApp } from "@/store/store";
import { StoreApi } from "zustand";

export const translate = ({
  modelName,
  source,
  params,
  store,
}: {
  store: StoreApi<StoreApp>;
  modelName?: string;
  source: string;
  params?: { [key: string]: any };
}) => {
  const { languageData } = store.getState();

  let newDataTranslate = source;

  let translateData = languageData.find((e) => e.sourceTerm === source);
  if (translateData) {
    newDataTranslate = translateData.translationValue;
  }

  return newDataTranslate;
};
