import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center container p-24">
      <HeroSection />
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        I am a Web developper based in Switzerland
      </h2>
    </main>
  );
}
