import "../globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export default async function Layout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable}`}>
      <body className="font-manrope">{children}</body>
    </html>
  );
}
