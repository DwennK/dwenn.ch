"use client";
import React from "react";
import Image from "next/image";
import { useTransition, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AboutSection = () => {
  return (
    <section className="">
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:py-16">
        <Image
          src="/images/about-image.png"
          alt="hero-image"
          width={500}
          height={500}
        />
        <div>
          <h2 className="text-4xl font-bold mb-4">About me</h2>
          <p className="text-base lg:text-lg">
            I&apos;m a full stack web developper with a passsion for creating
            interactive and responsive web applications. I have experiences with
            JavaScript, React, Node.js, Next.js, PostgreSQl, C#, HTMl, CSS and
            Git. I am a quick learner and I an always looking to expand my
            knowledge and my skill set. I am a team player and I am excited to
            work with others to create amazing applications.
          </p>
          <Tabs defaultValue="account" className="w-[400px] mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>
            <TabsContent value="skills">
              <ul className="list-disc pl-6">
                <li>C#</li>
                <li>Python</li>
                <li>Next.js</li>
                <li>JavaScript</li>
                <li>HTML</li>
                <li>CSS</li>
              </ul>
            </TabsContent>
            <TabsContent value="education">
              <ul className="list-disc pl-6">
                <li>Generalist IT Specialist with Federal VET Diploma.</li>
                <li>
                  Business Data Processing Specialist Advanced Federal Diploma
                  of Higher Education, Technicien ES en Informatique de Gestion
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="experience">
              <ul className="list-disc pl-6">
                <li>Developed a dozen websites</li>
                <li>
                  7 years of experience as a Business Data Processing Specialist
                </li>
                <li>Proficient with Wordpress for 10 years</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
