import { TranslatedTerm } from "@/interfaces/language";
import { User } from "@/interfaces/user";
import { create, createStore } from "zustand";

export type StoreApp = {
  localeCode: string;
  setLocaleCode: ({ localeCode }: { localeCode: string }) => void;
  languageData: TranslatedTerm[];
  setLanguageData: ({ datas }: { datas: TranslatedTerm[] }) => void;

  user?: User;
  login: (value?: User) => void;
  logout: () => void;
};

const store = createStore<StoreApp, []>((set) => ({
  localeCode: "en_US",
  languageData: [],
  setLocaleCode: ({ localeCode }: { localeCode: string }) => set({ localeCode: localeCode }),
  setLanguageData: ({ datas }: { datas: TranslatedTerm[] }) => {
    set((state: StoreApp) => {
      return {
        languageData: datas,
      };
    });
  },

  user: undefined,
  login: (value?: User) => set({ user: value }),
  logout: () => set({ user: undefined }),
}));

export default store;
