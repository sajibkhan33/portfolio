import { Outfit, Ovo } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

const ovo = Ovo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ovo",
});

export const metadata = {
  title: "Sajib Khan | MERN Stack Web Developer",
  description:
    "Personal portfolio of Sajib Khan, a MERN Stack Web Developer based in Bangladesh specializing in MongoDB, Express, React, Node.js, Next.js, and Tailwind CSS.",
  keywords: [
    "Sajib Khan",
    "MERN Stack Developer",
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Node.js Developer",
    "MongoDB",
    "Next.js",
    "Bangladesh",
    "Portfolio",
  ],
  authors: [{ name: "Sajib Khan" }],
  openGraph: {
    title: "Sajib Khan | MERN Stack Web Developer",
    description:
      "Passionate MERN Stack Web Developer building clean, responsive, and scalable full-stack web applications.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${ovo.variable} font-outfit antialiased leading-8 overflow-x-hidden dark:bg-black dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
