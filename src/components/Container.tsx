import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import type { ComponentPropsWithoutRef } from "react"

type ContainerProps = ComponentPropsWithoutRef<"div">

function Outer(
	{ className, children, ...props }: ContainerProps,
	ref: React.Ref<HTMLDivElement>,
) {
	return (
		<div ref={ref} className={cn("sm:px-8", className)} {...props}>
			<div className="mx-auto max-w-7xl lg:px-8">{children}</div>
		</div>
	)
}

const OuterContainer = forwardRef<HTMLDivElement, ContainerProps>(Outer)

function Inner(
	{ className, children, ...props }: ContainerProps,
	ref: React.Ref<HTMLDivElement>,
) {
	return (
		<div
			ref={ref}
			className={cn("relative px-4 sm:px-8 lg:px-12", className)}
			{...props}
		>
			<div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
		</div>
	)
}

const InnerContainer = forwardRef<HTMLDivElement, ContainerProps>(Inner)

function ContainerFn(
	{ children, ...props }: ContainerProps,
	ref: React.Ref<HTMLDivElement>,
) {
	return (
		<OuterContainer ref={ref} {...props}>
			<InnerContainer>{children}</InnerContainer>
		</OuterContainer>
	)
}

const ContainerComponent = forwardRef<HTMLDivElement, ContainerProps>(
	ContainerFn,
)

const Container = Object.assign(ContainerComponent, {
	Outer: OuterContainer,
	Inner: InnerContainer,
})

export default Container
