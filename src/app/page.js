import Link from "next/link";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { Button, MovingBorder } from "../components/ui/moving-border";
import { TextHoverEffect } from "../components/ui/text-hover-effect";
import { FadeInUp } from "../components/ui/page-transition";

export default function Home() {
  return (
    <div className="relative">
      <main className="">
        <BackgroundBeamsWithCollision className="h-[80vh] md:h-[60rem] lg:h-[100vh] relative">
          <div className="flex flex-col items-center justify-center h-full w-full relative z-20">
            <h2 className="text-4xl relative z-20 md:text-6xl lg:text-8xl xl:text-9xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
              {" "}
              <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-emerald-400 via-lime-300 to-emerald-600 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                  <span className=""></span>
                </div>
                <div className="relative py-4">
                  <TextHoverEffect text="Metra" duration={0.5} />
                </div>
              </div>
            </h2>
            <FadeInUp delay={0.3}>
              <div className="relative z-20 mt-4">
                <div className="relative h-auto w-auto overflow-hidden rounded-[1.25rem] p-[1px]">
                  <MovingBorder duration={2000} rx="30%" ry="30%">
                    <div className="h-12 w-12 bg-black/80 opacity-[0.8] shadow-lg" />
                  </MovingBorder>
                  <Link
                    href="/dashboard"
                    className="relative flex h-full w-full items-center justify-center rounded-[calc(1.25rem*0.96)] bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-500 px-6 py-1.5 text-xs md:text-sm lg:text-base font-semibold text-white antialiased shadow-lg hover:shadow-xl transition-all duration-300 hover:from-emerald-500 hover:via-lime-300 hover:to-emerald-600"
                  >
                    Launch App
                  </Link>
                </div>
              </div>
            </FadeInUp>
          </div>
        </BackgroundBeamsWithCollision>
      </main>
    </div>
  );
}