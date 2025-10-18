'use client';

import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";

const ExpandableCard = ({ item, isOpen, onClose }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            onClick={onClose}
          />
          
          {/* Expandable Card */}
          <motion.div
            ref={cardRef}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: 50
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: 50
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed inset-x-4 top-20 bottom-20 md:inset-x-8 md:top-16 md:bottom-16 lg:inset-x-16 lg:top-20 lg:bottom-20 z-50"
          >
            <div className="h-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.title.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                        {item.title}
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {item.category} • {item.value} points
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Featured Image/Header */}
                  <div className="mb-6">
                    <div 
                      className="w-full h-48 md:h-64 rounded-lg mb-4"
                      style={{ 
                        background: `linear-gradient(135deg, ${item.color}20, ${item.color}40)`,
                        border: `1px solid ${item.color}30`
                      }}
                    />
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                      Published: {new Date().toLocaleDateString()} • Reading time: 5 min
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                      Overview
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                      {item.description}
                    </p>

                    <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                      Detailed Analysis
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>

                    <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                      Key Insights
                    </h3>
                    <ul className="list-disc list-inside text-neutral-700 dark:text-neutral-300 mb-4 space-y-2">
                      <li>Innovation drives technological advancement and economic growth</li>
                      <li>Collaboration between different fields leads to breakthrough discoveries</li>
                      <li>User-centered design principles improve product adoption</li>
                      <li>Sustainable practices are becoming essential for long-term success</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                      Future Implications
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                      The future of {item.category.toLowerCase()} holds tremendous potential for growth and innovation. As we continue to explore new frontiers, we must remain mindful of the ethical implications and ensure that our advancements benefit all of humanity.
                    </p>

                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">1.2k likes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">45 comments</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors text-sm font-medium">
                            Share
                          </button>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExpandableCard;
