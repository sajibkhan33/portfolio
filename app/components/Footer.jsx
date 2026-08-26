import { assets } from "@/assets/assets";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

const Footer = ({ isDarkMode }) => {
  return (
    <footer className="mt-20 w-full relative">
      {/* Top CTA Banner */}
      <div className="px-[6%] lg:px-[12%]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 border border-purple-200/60 dark:border-purple-800/40 shadow-lg"
        >
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-4">
            <h2 className="text-2xl sm:text-4xl font-semibold font-ovo text-gray-800 dark:text-white">
              Let's build something extraordinary together!
            </h2>
            <p className="text-sm sm:text-base font-ovo text-gray-600 dark:text-gray-300">
              Have a project in mind or looking for a dedicated MERN Stack Developer? I'm available for freelance work and full-time roles.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="mt-2 px-8 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-ovo flex items-center gap-2 shadow-md hover:bg-purple-900 dark:hover:bg-purple-200 transition duration-300"
            >
              Get In Touch
              <Image
                src={isDarkMode ? assets.arrow_icon : assets.right_arrow_white}
                alt="Arrow"
                className="w-4"
              />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="px-[6%] lg:px-[12%] pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left items-start pb-10 border-b border-gray-300 dark:border-gray-800">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Image
              src={isDarkMode ? assets.sajib_dark : assets.sajib}
              alt="Sajib Khan Logo"
              className="w-36"
            />
            <p className="text-sm font-ovo text-gray-600 dark:text-gray-400 max-w-sm">
              MERN Stack Web Developer crafting modern, responsive, and performance-driven web applications.
            </p>
            <a
              href="mailto:sajib3323khan@gmail.com"
              className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-400 font-medium hover:underline mt-1"
            >
              <Image
                src={isDarkMode ? assets.mail_icon_dark : assets.mail_icon}
                alt="Mail"
                className="w-5"
              />
              sajib3323khan@gmail.com
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white font-ovo">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2 text-sm font-ovo text-gray-600 dark:text-gray-400">
              <li>
                <a href="#top" className="hover:text-purple-600 dark:hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-purple-600 dark:hover:text-white transition">
                  About Me
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-purple-600 dark:hover:text-white transition">
                  My Work
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-purple-600 dark:hover:text-white transition">
                  Contact Me
                </a>
              </li>
            </ul>
          </div>

          {/* Social Connect Badges */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white font-ovo">
              Connect With Me
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/sajibkhan33?tab=repositories"
                className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-ovo hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:-translate-y-1 transition duration-300 shadow-sm"
              >
                GitHub ↗
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/sajibkhan33"
                className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-ovo hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white hover:-translate-y-1 transition duration-300 shadow-sm"
              >
                LinkedIn ↗
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/sajib.khan.noornavi/"
                className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-ovo hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:-translate-y-1 transition duration-300 shadow-sm"
              >
                Facebook ↗
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-sm text-gray-500 dark:text-gray-400 font-ovo">
          <p>© 2025 Sajib Khan. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-xs text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              ⚙️ Admin Portal
            </Link>
            <a
              href="#top"
              aria-label="Back to top"
              className="flex items-center gap-1.5 hover:text-purple-600 dark:hover:text-white transition group"
            >
              <span>Back to top</span>
              <span className="group-hover:-translate-y-1 transition-transform duration-300">
                ↑
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
