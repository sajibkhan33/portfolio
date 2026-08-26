import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function NavBar({ isDarkMode, setIsDarkMode }) {
  const [isScroll, setIsScroll] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const sideMenuRef = useRef();

  const openMenu = () => {
    sideMenuRef.current.style.transform = "translateX(-16rem)";
  };
  const closeMenu = () => {
    sideMenuRef.current.style.transform = "translateX(16rem)";
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Alternating animation interval (toggles every 3.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setShowPhoto((prev) => !prev);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0 w-11/12 -z-10 translate-y-[-80%] dark:hidden">
        <Image src={assets.header_bg_color} alt="" className="w-full" />
      </div>
      <nav
        className={`w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 flex items-center justify-between z-50 ${
          isScroll
            ? "bg-white bg-opacity-50 backdrop-blur-lg shadow-sm dark:bg-black/50"
            : ""
        }`}
      >
        <a href="#top" className="mr-14 flex items-center cursor-pointer">
          <div className="h-10 w-32 flex items-center justify-start overflow-hidden relative">
            <AnimatePresence mode="wait">
              {!showPhoto ? (
                <motion.div
                  key="logo-name"
                  initial={{ y: 25, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -25, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex items-center font-bold text-2xl font-ovo tracking-widest cursor-pointer"
                >
                  {["S", "A", "J", "I", "B"].map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 12, scale: 0.7 }}
                      animate={{
                        opacity: 1,
                        y: [12, -4, 0],
                        scale: [0.7, 1.25, 1],
                      }}
                      transition={{
                        delay: index * 0.12,
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                      className="text-gray-900 dark:text-white inline-block hover:scale-125 transition-transform duration-200"
                    >
                      {letter}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 5 * 0.12 + 0.1, duration: 0.3 }}
                    className="text-purple-600 dark:text-purple-400 text-2xl font-bold ml-0.5"
                  >
                    .
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-photo"
                  initial={{ y: 25, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -25, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex items-center gap-2"
                >
                  <div className="relative p-0.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500">
                    <Image
                      src={assets.profile_img1}
                      alt="Sajib Khan"
                      className="w-8 h-8 rounded-full object-cover border border-white dark:border-black"
                    />
                  </div>
                  <div className="flex items-center font-bold text-lg font-ovo tracking-wider">
                    {["S", "a", "j", "i", "b"].map((letter, index) => {
                      const letterColors = [
                        "text-purple-600 dark:text-purple-400",
                        "text-pink-500 dark:text-pink-400",
                        "text-amber-500 dark:text-amber-400",
                        "text-emerald-500 dark:text-emerald-400",
                        "text-sky-500 dark:text-sky-400",
                      ];
                      return (
                        <motion.span
                          key={index}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.08, duration: 0.3 }}
                          className={`${letterColors[index % letterColors.length]} hover:scale-125 transition-transform duration-200 inline-block`}
                        >
                          {letter}
                        </motion.span>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </a>
        <ul
          className={`hidden  md:flex items-center gap-6 lg:gap-8 rounded-full px-12 py-3 ${
            isScroll
              ? ""
              : "bg-white shadow-sm bg-opacity-50 dark:border dark:border-white/50 dark:bg-transparent"
          } `}
        >
          <li>
            <a className="font-ovo" href="#top">
              Home
            </a>
          </li>
          <li>
            <a className="font-ovo" href="#about">
              About me
            </a>
          </li>
          {/* <li>
            <a className="font-ovo" href="#services">
              Services
            </a>
          </li> */}
          <li>
            <a className="font-ovo" href="#work">
              My Work
            </a>
          </li>
          <li>
            <a className="font-ovo" href="#contact">
              Contact me
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            aria-label="Toggle dark mode"
          >
            <Image
              src={isDarkMode ? assets.sun_icon : assets.moon_icon}
              alt="Theme toggle"
              className="w-6 "
            />
          </button>
          <a
            href="#contact"
            className="hidden lg:flex items-center gap-3 px-10 py-2.5 border  border-gray-500 rounded-full ml-4 font-ovo  dark:border-white/50 "
          >
            Contact
            <Image
              src={isDarkMode ? assets.arrow_icon_dark : assets.arrow_icon}
              alt="Arrow"
              className="w-3"
            ></Image>
          </a>

          <button
            className="block ml-3  md:hidden "
            onClick={openMenu}
            aria-label="Open menu"
          >
            <Image
              src={isDarkMode ? assets.menu_white : assets.menu_black}
              alt="Open menu"
              className="w-6 "
            />
          </button>
        </div>
        {/* mobile menu  */}
        <ul
          ref={sideMenuRef}
          className="flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-64 z-50 h-screen bg-rose-50 transition duration-500 dark:bg-black dark:text-white"
        >
          <div
            className="absolute right-6 top-6"
            onClick={closeMenu}
            role="button"
            aria-label="Close menu"
            tabIndex={0}
          >
            <Image
              src={isDarkMode ? assets.close_white : assets.close_black}
              alt="Close menu"
              className="w-5 cursor-pointer"
            />
          </div>
          <li>
            <a className="font-ovo" onClick={closeMenu} href="#top">
              Home
            </a>
          </li>
          <li>
            <a className="font-ovo" onClick={closeMenu} href="#about">
              About me
            </a>
          </li>
          {/* <li>
            <a className="font-ovo" onClick={closeMenu} href="#service">
              Services
            </a>
          </li> */}
          <li>
            <a className="font-ovo" onClick={closeMenu} href="#work">
              My Work
            </a>
          </li>
          <li>
            <a className="font-ovo" onClick={closeMenu} href="#contact">
              Contact me
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
