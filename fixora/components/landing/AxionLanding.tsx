"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Clock, Menu, X } from "lucide-react";
import AxionHeroShader from "./AxionHeroShader";

export function AxionLanding() {
  const [londonTime, setLondonTime] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());
      setLondonTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-900 selection:text-white font-sans">
      {/* SECTION 1: HERO */}
      <section className="h-screen flex flex-col justify-between relative bg-[#EFEFEF] overflow-hidden">
        {/* Animated Shader Overlay with Lime Green Accents */}
        <AxionHeroShader />

        {/* Navigation Header (z-20) */}
        <header className="z-20 relative max-w-[1440px] mx-auto w-full p-2 sm:p-3">
          <nav className="bg-white rounded-full p-[5px] flex items-center justify-between px-3 sm:px-4 shadow-sm">
            {/* LEFT */}
            <div className="flex items-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] sm:text-[11px] font-bold tracking-tight">
                  FX
                </span>
              </div>
              <div className="hidden md:flex items-center gap-6 ml-4 sm:ml-6">
                {["Audits", "AI Engine", "Scanners", "Dashboard"].map((link) => (
                  <a
                    key={link}
                    href={link === "Dashboard" ? "/dashboard" : `#${link.toLowerCase()}`}
                    className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-normal"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT (DESKTOP) */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <span className="text-[13px] text-gray-600 hidden lg:inline font-normal">
                Scanning web apps for Q1 2026
              </span>
              <div className="flex items-center gap-1.5 text-[13px] text-gray-600 font-normal">
                <Clock className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                <span>{londonTime ? `${londonTime} in London` : "London"}</span>
              </div>
              <a
                href="/dashboard"
                className="bg-gray-900 text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 flex items-center gap-3 group transition-colors duration-300 cursor-pointer"
              >
                <div className="overflow-hidden h-[20px] relative">
                  <div className="flex flex-col group-hover:-translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                    <span className="h-[20px] flex items-center whitespace-nowrap">
                      Start an audit call
                    </span>
                    <span className="h-[20px] flex items-center whitespace-nowrap">
                      Start an audit call
                    </span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-900 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                </div>
              </a>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-gray-900 text-white rounded-full p-2.5 flex items-center justify-center cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </nav>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div
              className="fixed inset-0 bg-black/60 transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative z-50 bg-white rounded-2xl mx-3 mb-3 p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                  <div className="flex items-center gap-1.5 text-[13px] text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <span>{londonTime ? `${londonTime} in London` : "London"}</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-900 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-4 text-[28px] sm:text-[32px] font-medium text-gray-900">
                  {["Audits", "AI Engine", "Scanners", "Dashboard"].map((link) => (
                    <a
                      key={link}
                      href={link === "Dashboard" ? "/dashboard" : `#${link.toLowerCase()}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="hover:text-gray-500 transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
              <div className="pt-8">
                <a
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#84cc16] text-white text-[14px] font-medium rounded-full px-6 py-3 flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <span>Start a free audit</span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#84cc16]">
                    <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Hero Content (z-20) */}
        <div className="z-20 relative flex-1 flex flex-col justify-end max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          <div className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide mb-5 sm:mb-8 font-normal">
            Fixora AI Studio
          </div>
          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
            We audit web apps &amp; generate
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            automated AI code fixes
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            for peak SEO &amp; performance.
          </h1>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            {/* Lime Green Button */}
            <a
              href="/dashboard"
              className="bg-[#84cc16] hover:bg-[#65a30d] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 flex items-center justify-between sm:justify-start gap-4 sm:gap-6 group transition-colors duration-300 cursor-pointer shadow-sm"
            >
              <div className="overflow-hidden h-[20px] relative">
                <div className="flex flex-col group-hover:-translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                  <span className="h-[20px] flex items-center whitespace-nowrap">
                    Start a free audit
                  </span>
                  <span className="h-[20px] flex items-center whitespace-nowrap">
                    Start a free audit
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-[#84cc16] shrink-0">
                <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              </div>
            </a>

            {/* Partner Badge with Lime Green Starburst Icon */}
            <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] rounded-[4px] px-3.5 py-2 flex items-center gap-2.5 transition-shadow duration-300 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#84cc16] shrink-0"
              >
                <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
              </svg>
              <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">
                Ollama Verified Partner
              </span>
              <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded font-medium">
                v2.5
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section id="audits" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden max-w-[1440px] mx-auto w-full">
        {/* Badge Row */}
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shrink-0">
            1
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
            Introducing Fixora Engine
          </div>
        </div>

        {/* Heading h2 */}
        <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28 px-5 sm:px-8 lg:px-12">
          Privacy-first website audits, delivering
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          100% local AI fixes in real-time.
        </h2>

        {/* Content area: MOBILE/TABLET */}
        <div className="lg:hidden px-5 sm:px-8 flex flex-col gap-8">
          <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900">
            Through local Ollama inference, deep SEO scanning and WCAG analysis we
            help modern dev teams optimize their digital full potential.
          </p>
          <div>
            <a
              href="/dashboard"
              className="bg-[#84cc16] hover:bg-[#65a30d] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 inline-flex items-center gap-4 group transition-colors duration-300 cursor-pointer shadow-sm"
            >
              <div className="overflow-hidden h-[20px] relative">
                <div className="flex flex-col group-hover:-translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                  <span className="h-[20px] flex items-center whitespace-nowrap">
                    About Fixora engine
                  </span>
                  <span className="h-[20px] flex items-center whitespace-nowrap">
                    About Fixora engine
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-[#84cc16] shrink-0">
                <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              </div>
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-2">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
              alt="Fixora AI audit score preview"
              className="sm:w-[45%] aspect-[438/346] rounded-xl sm:rounded-2xl object-cover w-full h-full"
            />
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
              alt="Fixora AI website scanner preview"
              className="sm:w-[55%] aspect-[900/600] rounded-xl sm:rounded-2xl object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Content area: DESKTOP */}
        <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8 px-5 sm:px-8 lg:px-12">
          {/* Left Column */}
          <div className="self-end">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
              alt="Fixora AI engine small preview"
              className="aspect-[438/346] rounded-2xl object-cover w-full"
            />
          </div>

          {/* Center Column */}
          <div className="self-start flex flex-col justify-end items-end text-right">
            <p className="text-[16px] xl:text-[18px] leading-[1.65] font-medium text-gray-900 whitespace-nowrap mb-8">
              Through local Ollama inference,
              <br />
              deep SEO scanning and WCAG
              <br />
              analysis we help modern dev teams
              <br />
              optimize their digital full potential.
            </p>
            <a
              href="/dashboard"
              className="bg-[#84cc16] hover:bg-[#65a30d] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 inline-flex items-center gap-4 group transition-colors duration-300 cursor-pointer shadow-sm"
            >
              <div className="overflow-hidden h-[20px] relative">
                <div className="flex flex-col group-hover:-translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                  <span className="h-[20px] flex items-center whitespace-nowrap">
                    About Fixora engine
                  </span>
                  <span className="h-[20px] flex items-center whitespace-nowrap">
                    About Fixora engine
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-[#84cc16] shrink-0">
                <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              </div>
            </a>
          </div>

          {/* Right Column */}
          <div className="self-end">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
              alt="Fixora AI engine large preview"
              className="aspect-[3/2] rounded-2xl object-cover w-full"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: CASE STUDIES / AUDIT ENGINES */}
      <section id="scanners" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 max-w-[1440px] mx-auto w-full">
        {/* Badge Row */}
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shrink-0">
            2
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
            Featured audit engines
          </div>
        </div>

        {/* Heading h2 */}
        <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16 px-5 sm:px-8 lg:px-12">
          Our audit capabilities
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 px-5 sm:px-8 lg:px-12">
          {/* Card 1: Core Web Vitals Engine */}
          <div>
            <div className="aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] relative group cursor-pointer">
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Hover Button */}
              <div className="absolute bottom-4 left-4 z-10 bg-white rounded-full h-9 w-9 group-hover:w-[148px] transition-all duration-300 ease-in-out flex items-center justify-between px-2.5 overflow-hidden shadow-lg">
                <span className="text-[13px] font-medium text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 pl-1.5">
                  Learn more
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 text-gray-900 -rotate-45 group-hover:rotate-0 transition-transform duration-300 ease-in-out shrink-0 ml-auto"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
            </div>
            <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed font-normal">
              Winner of DevTool of the Month 2025 - real-time LCP, CLS, and TTFB
              scanning with automated React code patches
            </p>
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
              Core Web Vitals Engine
            </h3>
          </div>

          {/* Card 2: WCAG 2.1 Scanner */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] relative group cursor-pointer">
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Hover Button */}
              <div className="absolute bottom-4 left-4 z-10 bg-gray-900 rounded-full h-9 w-9 group-hover:w-[168px] transition-all duration-300 ease-in-out flex items-center justify-between px-2.5 overflow-hidden shadow-lg">
                <span className="text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 pl-1.5">
                  View audit demo
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300 ease-in-out shrink-0 ml-auto" />
              </div>
            </div>
            <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed font-normal">
              Transforming complex accessibility contrast &amp; screen reader guidelines
              into 1-click automated fixes
            </p>
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
              WCAG 2.1 Scanner
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
}
