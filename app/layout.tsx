import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: { default: "StackPilot — AI Stack Advisor", template: "%s · StackPilot" },
  description: "Compare AI tools, design a stack, and export a project-ready PRD and architecture.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><TopBar />{children}<Footer /></body></html>;
}
