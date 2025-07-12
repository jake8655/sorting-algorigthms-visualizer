"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import LocaleSwitcher from "./locale-switcher";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		handleScroll(); // Initial check on mount
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<motion.header
			className={cn(
				"pointer-events-none fixed top-0 right-0 left-0 z-50 p-4 transition-all duration-300",
				scrolled
					? "pointer-events-auto bg-background/60 shadow-lg backdrop-blur-sm"
					: "pointer-events-none bg-transparent",
			)}
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="pointer-events-auto flex items-center">
						<Image
							src="/logo.png"
							width={50}
							height={50}
							className="h-8 w-8 md:h-12 md:w-12"
							alt="Sorting Algorithm Visualizer"
							priority
						/>
					</Link>

					{/* Navigation */}
					<nav>
						<ul className="flex items-center space-x-8">
							<li>
								<NavLink
									name="home"
									href="/"
									isActive={pathname === "/"}
									className="pointer-events-auto"
								/>
							</li>
							<li>
								<NavLink
									name="playground"
									href="/playground"
									isActive={pathname === "/playground"}
									className="pointer-events-auto"
								/>
							</li>
						</ul>
					</nav>

					{/* Language Selector */}
					<Suspense fallback={null}>
						<LocaleSwitcher className="pointer-events-auto" />
					</Suspense>
				</div>
			</div>
		</motion.header>
	);
}

function NavLink({
	name,
	href,
	className,
}: {
	name: "home" | "playground";
	href: string;
	isActive: boolean;
	className?: string;
}) {
	const t = useTranslations("navigation");

	const selectedLayoutSegment = useSelectedLayoutSegment();
	const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
	const isActive = pathname === href;

	return (
		<Link
			aria-current={isActive ? "page" : undefined}
			href={href}
			className={cn(
				"relative px-1 py-2 font-medium text-[oklch(0.984_0.003_247.858)] transition-all",
				isActive ? "font-semibold" : "hover:font-semibold",
				className,
			)}
		>
			{t(name)}
			{isActive && (
				<motion.div
					className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
					layoutId="navbar-indicator"
					transition={{ type: "spring", duration: 0.5 }}
				/>
			)}
		</Link>
	);
}
