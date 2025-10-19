import Link from "next/link";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { Button } from "../components/ui/moving-border";
import { TextHoverEffect } from "../components/ui/text-hover-effect";
import { FadeInUp } from "../components/ui/page-transition";

export default function Home() {
  return (
    <div className="relative">
      <main className="">
        <BackgroundBeamsWithCollision className="h-[80vh] md:h-[60rem] lg:h-[100vh] relative">
          <div className="flex flex-col items-center justify-center h-full w-full relative z-20 px-4">
            <h2 className="text-3xl sm:text-4xl relative z-20 md:text-6xl lg:text-8xl xl:text-9xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
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
              <div className="relative z-20 mt-3 sm:mt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold antialiased hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-300"
                >
                  Launch App
                </Link>
              </div>
            </FadeInUp>
          </div>
        </BackgroundBeamsWithCollision>
      </main>
    </div>
  );
}