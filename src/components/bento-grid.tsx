"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconDrone,
  IconLeaf,
  IconChartLine,
  IconCloudRain,
  IconEye,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function BentoGridThirdDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem] mt-12 mb-12">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const FeatureOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-start space-x-2 bg-white dark:bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex-shrink-0" />
        <p className="text-xs text-neutral-500">
          Арамшөптер мен зиянкестерді тиімді түрде анықтап, оларды жасанды
          интеллект арқылы жіктеу, қол еңбегін азайтады.
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black"
      >
        <p className="text-xs text-neutral-500">Ресурстарды оңтайландыру.</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex-shrink-0" />
      </motion.div>
    </motion.div>
  );
};

const FeatureTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <Image
        src="/bento-5.png"
        alt="Өнімді нақты уақыт режимінде бақылау"
        height="200"
        width="400"
        className="rounded-lg"
      />
    </motion.div>
  );
};

const FeatureThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
      style={{
        background:
          "linear-gradient(-45deg, #6b8e23, #32cd32, #8fbc8f, #00ff7f)",
        backgroundSize: "400% 400%",
      }}
    >
      <Image
        src="https://agri-hub.co.uk/wp-content/uploads/2022/02/dji-gfd568f84a_1920-web.png" // Replace with actual image URL
        alt="Өнімділікті болжау"
        height="200"
        width="400"
        className="rounded-lg"
      />
    </motion.div>
  );
};

const FeatureFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <Image
          src="/logo.png"
          alt="drone"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Автономды навигация: GPS арқылы автономды навигация егістік алқаптарын
          дәл қамтуға мүмкіндік береді.
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <Image
          src="/logo.png"
          alt="drone"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Нақты уақыттағы мониторинг
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <Image
          src="/logo.png"
          alt="drone"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Ақылды оңтайландыру
        </p>
      </motion.div>
    </motion.div>
  );
};

const FeatureFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black"
      >
        <Image
          src="/logo.png"
          alt="drone"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="text-xs text-neutral-500">
          Дәлдікпен бүрку: Тыңайтқыштар мен пестицидтерді дәл және тиімді түрде
          бүрку.
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white dark:bg-black"
      >
        <p className="text-xs text-neutral-500">Ресурстарды оңтайландыру.</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex-shrink-0" />
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Жасанды интеллект арқылы арамшөптерді анықтау",
    description: (
      <span className="text-sm">
        Арамшөптер мен зиянкестерді жасанды интеллект арқылы тиімді анықтап,
        жіктеңіз.
      </span>
    ),
    header: <FeatureOne />,
    className: "md:col-span-1",
    icon: <IconLeaf className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Өнімді нақты уақытта бақылау",
    description: (
      <span className="text-sm">
        Жоғары ажыратымдылықтағы бейнелеу арқылы бақылаңыз.
      </span>
    ),
    header: <FeatureTwo />,
    className: "md:col-span-1",
    icon: <IconEye className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Өнімділікті болжау",
    description: (
      <span className="text-sm">
        Өнімділікті болжап, егін жинау процесін оңтайландыру үшін жасанды
        интеллектті қолданыңыз.
      </span>
    ),
    header: <FeatureThree />,
    className: "md:col-span-1",
    icon: <IconChartLine className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Автономды навигация",
    description: (
      <span className="text-sm">
        GPS арқылы автономды навигация егістік алқаптарын дәл қамтуға мүмкіндік
        береді.
      </span>
    ),
    header: <FeatureFour />,
    className: "md:col-span-2",
    icon: <IconDrone className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "Дәлдікпен бүрку",
    description: (
      <span className="text-sm">
        Тыңайтқыштар мен пестицидтерді дәл және тиімді түрде бүрку.
      </span>
    ),
    header: <FeatureFive />,
    className: "md:col-span-1",
    icon: <IconCloudRain className="h-4 w-4 text-neutral-500" />,
  },
];
