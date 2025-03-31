import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="flex items-center justify-start gap-2 group/sidebar w-20 h-20 -ml-1 mt-1"
    >
      {/* <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" /> */}
      <Image
        src="/assets/logos/lilia-logo.png"
        alt="Lilia Logo"
        width={300}
        height={300}
        priority
      />
    </Link>
  );
};


export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/assets/logos/lilia-logo.png"
        alt="Lilia Logo"
        width={50}
        height={50}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Lilia
      </motion.span>
    </Link>
  );
};
