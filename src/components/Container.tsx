import React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentPropsWithoutRef<"div">;

const Outer = React.forwardRef<HTMLDivElement, ContainerProps>(function Outer(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cn("sm:px-8", className)} {...props}>
      <div className="mx-auto max-7xl lg:px-8">{children}</div>
    </div>
  );
});

const Inner = React.forwardRef<HTMLDivElement, ContainerProps>(function Inner(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("relative px-4 sm:px-8 lg:px-12", className)}
      {...props}
    >
      <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
    </div>
  );
});

const ContainerComponent = React.forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ children, ...props }: ContainerProps, ref) {
    return (
      <Outer ref={ref} {...props}>
        <Inner>{children}</Inner>
      </Outer>
    );
  }
);

const Container = Object.assign(ContainerComponent, {
  Outer: Outer,
  Inner: Inner,
});

export default Container;
