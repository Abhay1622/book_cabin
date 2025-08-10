import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      <Image
        src="/background.webp"
        alt="Hotel background"
        fill
        priority
        className="object-cover object-center z-0"
      />

      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>

      <div className="relative z-30">
      </div>

      <div className="h-full flex items-center justify-center text-white text-center relative z-20 px-4">
        <div>
          <h1 className="text-5xl md:text-7xl font-medium">Welcome to Paradise</h1>
          <Link href={'/cabins'}><button className="bg-[#C69963] text-[#2C3D4F] p-4 mt-5 cursor-pointer hover:bg-[#B8875A] transition-colors">
            Explore luxury cabins
          </button></Link>
        </div>
      </div>
    </div>
  );
}