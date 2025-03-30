interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <section className="flex h-full w-full flex-1 flex-col gap-2 rounded-t-2xl md:rounded-tl-[3rem] border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      {children}
    </section>
  );
};

export default PageWrapper;
