import Link from "next/link";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button, MovingBorder } from "@/components/ui/moving-border";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <BackgroundBeamsWithCollision className="h-[80vh] md:h-[60rem] lg:h-[100vh]">
          <div className="flex flex-col items-center justify-center h-full w-full">
            <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
              {" "}
              <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-emerald-400 via-lime-300 to-emerald-600 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                  <span className=""></span>
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-emerald-700 via-lime-200 to-emerald-800 py-4">
                  <span className="">Metra</span>
                </div>
              </div>
            </h2>
            <div className="relative z-20 mt-4">
              <div className="relative h-auto w-auto overflow-hidden rounded-[1.75rem] p-[1px]">
                <MovingBorder duration={2000} rx="30%" ry="30%">
                  <div className="h-20 w-20 bg-black/80 opacity-[0.8] shadow-lg" />
                </MovingBorder>
                <Link
                  href="/dashboard"
                  className="relative flex h-full w-full items-center justify-center rounded-[calc(1.75rem*0.96)] bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-500 px-12 py-3 text-base md:text-lg lg:text-xl font-semibold text-white antialiased shadow-lg hover:shadow-xl transition-all duration-300 hover:from-emerald-500 hover:via-lime-300 hover:to-emerald-600"
                >
                  Launch App
                </Link>
              </div>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </main>
    </div>
  );
}