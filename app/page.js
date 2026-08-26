"use client";

import { useEffect, useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Services from "./components/Services";
import Work from "./components/Work";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    // Fetch dynamic portfolio data
    const loadPortfolioData = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const json = await res.json();
        if (json.success) {
          setPortfolioData(json.data);
        }
      } catch (err) {
        console.error("Failed to load dynamic portfolio data:", err);
      }
    };
    loadPortfolioData();
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "");
    }
  }, [isDarkMode, isMounted]);

  return (
    <>
      <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Header
        isDarkMode={isDarkMode}
        personalInfo={portfolioData?.personalInfo}
      />
      <About
        isDarkMode={isDarkMode}
        skills={portfolioData?.skills}
        personalInfo={portfolioData?.personalInfo}
      />
      {/* <Services isDarkMode={isDarkMode} /> */}
      <Work
        isDarkMode={isDarkMode}
        projects={portfolioData?.projects}
      />
      <Contact isDarkMode={isDarkMode} />
      <Footer isDarkMode={isDarkMode} />
    </>
  );
}
