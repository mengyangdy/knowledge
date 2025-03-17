"use client";

import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import Container from "./Container";
import React from "react";
import { Avatar } from "./Avatar";
import { NavigationBar } from "./NavigationBar";
import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('./ThemeToggle'), {
	ssr: false
});

export default function Header() {
  const isHomePage = usePathname() === "/";
  const headerRef = React.useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const avatarX = useMotionValue(0);
  const avatarScale = useMotionValue(1);

  const avatarBorderX = useMotionValue(0);
  const avatarBorderScale = useMotionValue(1);
  const avatarBorderTransform = useMotionTemplate`translate3d(${avatarBorderX}rem, 0, 0) scale(${avatarBorderScale})`;

  const avatarTransform = useMotionTemplate`translate3d(${avatarX}rem, 0, 0) scale(${avatarScale})`;

  const [isShowingAltAvatar, setIsShowingAltAvatar] = React.useState(false);
  const onAvatarContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsShowingAltAvatar((prev) => !prev);
    },
    []
  );

  return (
    <>
      <motion.header
        className={cn(
          "pointer-events-none relative z-50 mb-[var(--header-mb,0px)] flex flex-col",
          isHomePage
            ? "h-[var(--header-height,180px)]"
            : "h-[var(--header-height,64px)]"
        )}
        layout
        layoutRoot
      >
        <AnimatePresence>
          {isHomePage && (
            <>
            {/* 首页空行 */}
              <div
                ref={avatarRef}
                className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
              ></div>
              <Container
                className="top-0 order-last -mb-3 pt-3"
                style={{
                  position:
                    "var(--header-position)" as React.CSSProperties["position"],
                }}
              >
                <motion.div
                  className="top-[var(--avatar-top,theme(spacing.3))] w-full select-none"
                  style={{
                    position:
                      "var(--header-inner-position)" as React.CSSProperties["position"],
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 200,
                  }}
                >
                  <motion.div
                    className="relative inline-flex"
                    layoutId="avatar"
                    layout
                    onContextMenu={onAvatarContextMenu}
                  >
                    <motion.div
                      className="absolute left-0 top-3 origin-left opacity-[var(--avatar-border-opacity,0)] transition-opacity"
                      style={{
                        transform: avatarBorderTransform,
                      }}
                    >
                      <Avatar />
                    </motion.div>

                    <motion.div
                      className="block h-16 w-16 origin-left "
                      style={{
                        transform: avatarTransform,
                      }}
                    >
                      <Avatar.Image
                        large
                        alt={isShowingAltAvatar}
                        className="block h-full w-full hover:animate-spin"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Container>
            </>
          )}
        </AnimatePresence>
        {/* nav组件 */}
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{
            position:
              "var(--header-position)" as React.CSSProperties["position"],
          }}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{
              position:
                "var(--header-inner-position)" as React.CSSProperties["position"],
            }}
          >
            <div className="relative flex gap-4">
              <motion.div
                className="flex flex-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 200,
                }}
              >
                <AnimatePresence>
                  {!isHomePage && (
                    <motion.div
                      layoutId="avatar"
                      layout
                      onContextMenu={onAvatarContextMenu}
                    >
                      <Avatar>
                        <Avatar.Image alt={isShowingAltAvatar} />
                      </Avatar>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <div className="flex flex-1 justify-end md:justify-center">
                <NavigationBar.Mobile className="pointer-events-auto relative z-50 md:hidden" />
                <NavigationBar.Desktop className="pointer-events-auto relative z-50 hidden md:block" />
              </div>
              <motion.div
                className="flex justify-end gap-3 md:flex-1"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <div className="pointer-events-auto">
                  <ThemeToggle />
                </div>
              </motion.div>
            </div>
          </Container>
        </div>
      </motion.header>
      {isHomePage && <div className="h-[--content-offset]" />}
    </>
  );
}
