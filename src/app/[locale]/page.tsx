"use client";

import {
	ArrowRight,
	BarChart3,
	Layers,
	Shuffle,
	SortAsc,
	Split,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { BubbleBackground } from "@/components/animate-ui/bubble-background";
import { GradientText } from "@/components/animate-ui/gradient-text";
import { RippleButton } from "@/components/animate-ui/ripple-button";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
	const t = useTranslations("home");

	return (
		<div className="min-h-screen bg-[oklch(0.129_0.042_264.695)]">
			{/* Hero Section */}
			<section className="pointer-events-none relative h-[90vh] overflow-hidden">
				<div className="pointer-events-auto absolute inset-0 opacity-50">
					<BubbleBackground
						interactive={true}
						colors={{
							first: "146,113,255",
							second: "221,74,255",
							third: "0,220,255",
							fourth: "200,50,50",
							fifth: "180,180,50",
							sixth: "140,100,255",
						}}
					/>
				</div>

				<div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="pointer-events-auto mb-6 font-extrabold text-5xl text-[oklch(0.984_0.003_247.858)] md:text-7xl">
							{t("hero.title")
								.split(" ")
								.map((word, index, words) => (
									<span className="inline-block" key={word}>
										<motion.span
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: (index + 1) * 0.2, duration: 0.8 }}
										>
											{index === words.length - 1 ? (
												<GradientText text={word} neon />
											) : (
												<span>{word}&nbsp;</span>
											)}
										</motion.span>
									</span>
								))}
						</h1>

						<motion.p
							className="pointer-events-auto mx-auto max-w-2xl text-balance text-[oklch(0.984_0.003_247.858)] text-xl opacity-80 md:text-2xl"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.8 }}
						>
							{t("hero.about")}
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1, duration: 0.8 }}
							className="mt-10"
						>
							<Link href="/playground" className="pointer-events-auto">
								<RippleButton className="group rounded-xl bg-foreground px-6 py-6 text-background text-lg hover:bg-foreground/80">
									{t("hero.call-to-action")}
									<ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
								</RippleButton>
							</Link>
						</motion.div>
					</motion.div>
				</div>

				<motion.div
					className="-translate-x-1/2 absolute bottom-8 left-1/2 transform"
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
				>
					<div className="flex h-10 w-6 justify-center rounded-full border-2 border-foreground">
						<motion.div
							className="mt-1 h-3 w-1.5 rounded-full bg-foreground"
							animate={{ y: [0, 4, 0] }}
							transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
						/>
					</div>
				</motion.div>
			</section>

			{/* Information Section */}
			<section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
				<div className="grid items-center gap-12 md:grid-cols-2">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2 className="mb-6 font-bold text-3xl text-[oklch(0.984_0.003_247.858)] md:text-4xl">
							{t("info.title")}
						</h2>
						<div className="space-y-4">
							{t.rich("info.description", {
								paragraph: (chunks) => <p className="text-lg">{chunks}</p>,
							})}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="rounded-2xl bg-[oklch(0.208_0.042_265.755)] p-8"
					>
						<h3 className="mb-4 font-bold text-2xl text-[oklch(0.984_0.003_247.858)]">
							{t("info.title2")}
						</h3>
						<ul className="list-inside list-disc space-y-3 text-[oklch(0.984_0.003_247.858)/90]">
							{t.rich("info.description2", {
								point: (chunks) => <li>{chunks}</li>,
							})}
						</ul>
					</motion.div>
				</div>
			</section>

			{/* Algorithms Section */}
			<section className="bg-[oklch(0.208_0.042_265.755)/30] px-4 py-20 md:px-8">
				<div className="mx-auto max-w-7xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="mb-16 text-center"
					>
						<h2 className="mb-4 font-bold text-3xl text-[oklch(0.984_0.003_247.858)] md:text-4xl">
							{t("algorithms.title")}
						</h2>
						<p className="mx-auto max-w-3xl text-[oklch(0.984_0.003_247.858)/80] text-lg">
							{t("algorithms.description")}
						</p>
					</motion.div>

					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{
								name: t("algorithms.bubble-sort.title"),
								icon: (
									<BarChart3 className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
								),
								description: t("algorithms.bubble-sort.description"),
								queryParam: "bubble",
							},
							{
								name: t("algorithms.selection-sort.title"),
								icon: (
									<SortAsc className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
								),
								description: t("algorithms.selection-sort.description"),
								queryParam: "selection",
							},
							{
								name: t("algorithms.insertion-sort.title"),
								icon: (
									<Shuffle className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
								),
								description: t("algorithms.insertion-sort.description"),
								queryParam: "insertion",
							},
							{
								name: t("algorithms.quick-sort.title"),
								icon: (
									<Split className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
								),
								description: t("algorithms.quick-sort.description"),
								queryParam: "quicksort",
							},
						].map((algorithm, index) => (
							<motion.div
								key={algorithm.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Link
									href={{
										pathname: "/playground",
										query: { algorithm: algorithm.queryParam },
									}}
									className="block"
								>
									<div className="hover:-translate-y-1 group h-full rounded-xl bg-[oklch(0.208_0.042_265.755)] p-6 transition-all duration-300 hover:shadow-[oklch(0.929_0.013_255.508)/20] hover:shadow-lg">
										<div className="mb-4 text-[oklch(0.929_0.013_255.508)]">
											{algorithm.icon}
										</div>
										<h3 className="mb-2 font-bold text-[oklch(0.984_0.003_247.858)] text-xl">
											{algorithm.name}
										</h3>
										<p className="mb-4 text-[oklch(0.984_0.003_247.858)/70]">
											{algorithm.description}
										</p>
										<div className="flex items-center font-medium text-[oklch(0.929_0.013_255.508)]">
											<span>{t("algorithms.call-to-action")}</span>
											<ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.5 }}
						viewport={{ once: true }}
						className="mt-12 text-center"
					>
						<Link href="/playground">
							<RippleButton
								variant="secondary"
								className="rounded-xl bg-[oklch(0.279_0.041_260.031)] px-6 py-6 text-[oklch(0.984_0.003_247.858)] text-lg hover:bg-[oklch(0.279_0.041_260.031)/90]"
							>
								{t("algorithms.call-to-action2")}
								<Layers className="ml-2 h-5 w-5" />
							</RippleButton>
						</Link>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
