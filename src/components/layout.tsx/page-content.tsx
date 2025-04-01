import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className }: PageWrapperProps) => {
  return (
    <section
      className={cn(
        "flex overflow-auto h-full w-full flex-1 flex-col gap-2 rounded-t-2xl md:rounded-tl-[3rem] border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900",
        className
      )}
    >
      {children}
    </section>
  );
};

export default PageWrapper;
