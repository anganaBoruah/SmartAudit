import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import MantineClientWrapper from "../components/MantineClientWrapper";
import "./globals.css";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartAudit",
  description: "AI Smart Contract Auditor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <MantineClientWrapper>{children}</MantineClientWrapper>
      </body>
    </html>
  );
}
