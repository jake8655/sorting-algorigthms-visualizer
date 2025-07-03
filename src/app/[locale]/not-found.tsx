"use client";

import { ArrowRight, Home } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { GradientText } from "@/components/animate-ui/gradient-text";
import { HoleBackground } from "@/components/animate-ui/hole-background";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
	const t = useTranslations("not-found");

	return (
		<div className="relative flex min-h-screen items-center justify-center">
			<HoleBackground className="absolute inset-0" />

			<div className="relative z-10 max-w-3xl px-4 text-center">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="mb-8"
				>
					<h1 className="mb-2 bg-clip-text font-black text-7xl">
						<GradientText text="404" neon />
					</h1>
					<motion.h2
						className="mb-4 font-bold text-4xl text-white md:text-5xl"
						initial={{ scale: 1 }}
						animate={{
							scale: [1, 1.02, 0.98, 1],
							rotate: [0, 0.5, -0.5, 0],
						}}
						transition={{
							duration: 4,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
						}}
					>
						{t.rich("title", {
							newline: (chunks) => (
								<span className="block md:inline">{chunks}</span>
							),
						})}
					</motion.h2>
					<motion.p
						className="mx-auto max-w-2xl text-gray-200 text-lg md:text-xl"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 1 }}
					>
						{t("description")}
					</motion.p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.8 }}
					className="mt-8"
				>
					<Link
						href="/"
						className="group relative inline-flex items-center justify-center"
					>
						<div className="-inset-0.5 absolute rounded-lg bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 opacity-70 blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:blur-md" />
						<div className="relative flex items-center space-x-2 rounded-lg bg-black px-6 py-4 text-white transition-all duration-200 group-hover:bg-opacity-90">
							<Home className="h-5 w-5" />
							<span className="font-medium">{t("link")}</span>
							<ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
						</div>
					</Link>
				</motion.div>
			</div>
		</div>
	);
}
