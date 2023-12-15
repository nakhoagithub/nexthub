// "use client";
import { StoreContext } from "@/app/components/context-provider";
import { useContext } from "react";

export const translate = ({
  modelName,
  source,
  params,
}: {
  modelName?: string;
  source: string;
  params?: { [key: string]: any };
}) => {
  const store = useContext(StoreContext);
  const { languageData } = store.getState();

  let newDataTranslate = source;

  let translateData = languageData.find((e) => e.sourceTerm === source);
  if (translateData) {
    newDataTranslate = translateData.translationValue;
  }

  return newDataTranslate;
};
