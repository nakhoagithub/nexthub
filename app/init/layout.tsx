import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Init",
  description: "Generated by Anh Khoa",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
