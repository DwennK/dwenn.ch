"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Contact } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

export const HeroSection = () => {
  return (
    <section>
      {" "}
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl  h-[3em] md:h-[2em]">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
          Hello, I&apos;m {""}
          <br />
        </span>
        <span className="">
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              "Dwenn",
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              "a Web Developper",
              1000,
              "a Mobile Developper",
              1000,
              "a UI/UX Designer",
              1000,
              "a C# Developper",
              1000,
            ]}
            wrapper="span"
            style={{ display: "inline-block" }}
            speed={50}
            repeat={Infinity}
          />
        </span>
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        I established{" "}
        <Link
          className="font-bold hover:text-blue-600"
          href="https://peaks.ch/"
        >
          Peaks.ch
        </Link>{" "}
        with the aim of empowering small businesses to enhance their online
        presence.
      </p>
      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          h22222222222
        </h2>
      </div>
      <div className="mt-4 mb-4">
        {" "}
        <Button className="mr-4 mt-2">
          <Contact className="mr-2 h-4 w-4" />
          Hire me
        </Button>
        <Button variant="outline" className="mr-4 mt-2">
          <Download className="mr-2 h-4 w-4" />
          Download CV
        </Button>
      </div>
      <div className="col-span-5 mt-4 mb-4">
        <div className="rounded-full bg-slate-200 dark:bg-slate-900 flex items-center justify-center relative">
          <Image
            src="/images/hero-image.png"
            alt="hero image"
            width={300}
            height={300}
          ></Image>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
