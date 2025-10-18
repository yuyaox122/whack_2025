import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import Link from "next/link";

export default function Dashboard() {
  const items = [
    {
      title: "The Dawn of Innovation",
      description: "Explore the birth of groundbreaking ideas and inventions.",
      header: <div className="h-32 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-blue-500 rounded-full"></div>,
    },
    {
      title: "The Digital Revolution",
      description: "Dive into the transformative power of technology.",
      header: <div className="h-32 w-full bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-green-500 rounded-full"></div>,
    },
    {
      title: "The Art of Design",
      description: "Discover the beauty of thoughtful and functional design.",
      header: <div className="h-32 w-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-yellow-500 rounded-full"></div>,
    },
    {
      title: "The Power of Communication",
      description: "Understand the impact of effective communication in our lives.",
      header: <div className="h-32 w-full bg-gradient-to-r from-red-500 to-pink-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-red-500 rounded-full"></div>,
    },
    {
      title: "The Pursuit of Knowledge",
      description: "Join the quest for understanding and enlightenment.",
      header: <div className="h-32 w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-indigo-500 rounded-full"></div>,
    },
    {
      title: "The Joy of Creation",
      description: "Experience the thrill of bringing ideas to life.",
      header: <div className="h-32 w-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-teal-500 rounded-full"></div>,
    },
    {
      title: "The Spirit of Adventure",
      description: "Embark on exciting journeys and thrilling discoveries.",
      header: <div className="h-32 w-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-violet-500 rounded-full"></div>,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        {/* Navbar */}
        <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                Dashboard
              </h1>
              <Link 
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                  />
                </svg>
                Home
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <BentoGrid className="max-w-4xl mx-auto">
              {items.map((item, i) => (
                <BentoGridItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  header={item.header}
                  icon={item.icon}
                  className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                />
              ))}
            </BentoGrid>
          </div>
        </div>
    </div>
  );
}
