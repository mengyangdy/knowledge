"use client";

import BaseConfig from "@/config";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HTMLAttributes, useCallback } from "react";



interface NavItemProps {
  href: string;
  children: React.ReactNode;
  menu: boolean | undefined;
}

function NavItem({ href, children, menu }: NavItemProps) {
  const moreHrefList = ["/icon"];
  const formatHref = (href: string) => {
    if (moreHrefList.includes(href)) {
      return `/more`;
    }
    return href;
  };

  const isActive = formatHref(usePathname()) === href;

  const ActiveBox = () => (
		<motion.span
			className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-violet-600/0 via-violet-600/70 to-violet-500/0 dark:from-violet-400/0 dark:via-violet-400/40 dark:to-violet-400/0"
			layoutId="active-nav-item"
		/>
	);

  return (
    <li
      className={cn(
        "relative block whitespace-nowrap px-3 py-2 transition",
        isActive
          ? "text-violet-500 dark:text-violet-400"
          : "hover:text-violet-500 dark:hover:text-violet-400"
      )}
    >
      <Link
        href={href}
        prefetch
        target={href === "/feed.xml" ? "_blank" : "_self"}
      >
        {children}
        {isActive && <ActiveBox />}
      </Link>
    </li>
  );
}

function Pc({ className, ...props }: HTMLAttributes<HTMLDListElement>) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = useMotionValue(0);

  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - bounds.left);
      mouseY.set(clientY - bounds.top);
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5);
    },
    [mouseX, mouseY, radius]
  );

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`;

  return (
    <nav
      onMouseMove={handleMouseMove}
      className={cn(
        className,
        "group relative",
        "rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90",
        "shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md",
        "dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10",
        "[--spotlight-color:rgb(236_252_203_/_0.6)] dark:[--spotlight-color:rgb(217_249_157_/_0.07)]"
      )}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
        aria-hidden="true"
      />
      <ul className="flex bg-transparent px-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {BaseConfig.navs.map(({ link, text, menu }) => (
          <NavItem key={link} href={link} menu={menu}>
            {text}
          </NavItem>
        ))}
      </ul>
    </nav>
  );
}

const NavigationBar = {
  Pc,
} as const;

export default NavigationBar;
