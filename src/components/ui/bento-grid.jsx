import { cn } from "../../lib/utils";

export const BentoGrid = ({
  className,
  children
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-6 md:gap-8 md:auto-rows-[300px] md:grid-cols-3",
        className
      )}>
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-emerald-500/20 bg-black/40 backdrop-blur-md p-4 transition duration-200 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-emerald-500/20 dark:bg-black/40 dark:shadow-none",
        className
      )}>
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-1">
        {icon && icon}
        <div
          className="mt-2 mb-2 font-sans font-bold text-white">
          {title}
        </div>
        <div
          className="font-sans text-xs font-normal text-white/80">
          {description}
        </div>
      </div>
    </div>
  );
};
