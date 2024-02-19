import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>
        I established{" "}
        <Link
          className="font-bold hover:text-blue-600"
          href="https://peaks.ch/"
        >
          Peaks.ch
        </Link>{" "}
        with the aim of empowering small businesses to enhance their online
        presence.
      </h1>
    </main>
  );
}
