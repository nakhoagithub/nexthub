"use client";
import { StoreApp } from "@/store/store";
import { StoreApi } from "zustand";

export const translate = ({
  source,
  params,
  store,
  modelName,
}: {
  store: StoreApi<StoreApp>;
  source: string;
  params?: { [key: string]: any };
  modelName?: string;
}) => {
  const { languageData } = store.getState();

  let newDataTranslate = source;

  let translatedData = languageData.find((e) => {
    return e.sourceTerm == source;
  });

  if (translatedData) {
    newDataTranslate = translatedData.translationValue;
  }

  return newDataTranslate;
};
