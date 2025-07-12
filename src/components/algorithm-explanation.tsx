"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { type JSX, useState } from "react";
import {
	Tabs,
	TabsContent,
	TabsContents,
	TabsList,
	TabsTrigger,
} from "@/components/animate-ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { type Algorithm, cn, getAlgorithmCode } from "@/lib/utils";
import { RippleButton } from "./animate-ui/ripple-button";

interface AlgorithmExplanationProps {
	algorithm: Algorithm;
	iterations: number;
	swaps: number;
	highlightedAlgorithmCode: JSX.Element;
	className?: string;
}

export default function AlgorithmExplanation({
	algorithm,
	iterations,
	swaps,
	highlightedAlgorithmCode,
	className,
}: AlgorithmExplanationProps) {
	const t = useTranslations("algorithm-explanation");

	const [copied, setCopied] = useState<string | null>(null);

	const copyCode = (code: string) => {
		navigator.clipboard.writeText(code);
		setCopied(code);

		setTimeout(() => {
			setCopied(null);
		}, 2000);
	};

	const algorithmData = {
		bubble: {
			title: t("bubble.title"),
			description: t("bubble.description"),
			steps: [
				t("bubble.steps.0"),
				t("bubble.steps.1"),
				t("bubble.steps.2"),
				t("bubble.steps.3"),
			],
			timeComplexity: {
				best: "O(n)",
				average: "O(n²)",
				worst: "O(n²)",
			},
			spaceComplexity: "O(1)",
			bestCase: t("bubble.best-case"),
			averageCase: t("bubble.average-case"),
			worstCase: t("bubble.worst-case"),
		},
		selection: {
			title: t("selection.title"),
			description: t("selection.description"),
			steps: [
				t("selection.steps.0"),
				t("selection.steps.1"),
				t("selection.steps.2"),
				t("selection.steps.3"),
			],
			timeComplexity: {
				best: "O(n²)",
				average: "O(n²)",
				worst: "O(n²)",
			},
			spaceComplexity: "O(1)",
			bestCase: t("selection.best-case"),
			averageCase: t("selection.average-case"),
			worstCase: t("selection.worst-case"),
		},
		insertion: {
			title: t("insertion.title"),
			description: t("insertion.description"),
			steps: [
				t("insertion.steps.0"),
				t("insertion.steps.1"),
				t("insertion.steps.2"),
				t("insertion.steps.3"),
			],
			timeComplexity: {
				best: "O(n)",
				average: "O(n²)",
				worst: "O(n²)",
			},
			spaceComplexity: "O(1)",
			bestCase: t("insertion.best-case"),
			averageCase: t("insertion.average-case"),
			worstCase: t("insertion.worst-case"),
		},
		quicksort: {
			title: t("quicksort.title"),
			description: t("quicksort.description"),
			steps: [
				t("quicksort.steps.0"),
				t("quicksort.steps.1"),
				t("quicksort.steps.2"),
				t("quicksort.steps.3"),
				t("quicksort.steps.4"),
			],
			timeComplexity: {
				best: "O(n log n)",
				average: "O(n log n)",
				worst: "O(n²)",
			},
			spaceComplexity: "O(log n)",
			bestCase: t("quicksort.best-case"),
			averageCase: t("quicksort.average-case"),
			worstCase: t("quicksort.worst-case"),
		},
	};

	const currentAlgorithm = algorithmData[algorithm];

	return (
		<div className={cn("w-full px-4 md:mx-0", className)}>
			<Card>
				<CardHeader>
					<CardTitle>{currentAlgorithm.title}</CardTitle>
					<CardDescription>{currentAlgorithm.description}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6 md:grid-cols-2">
						{/* Stats Section */}
						<div className="space-y-4">
							<h3 className="font-semibold text-lg">{t("stats.title")}</h3>

							<div className="grid grid-cols-2 gap-4">
								<div className="rounded-lg border bg-card p-3">
									<div className="text-muted-foreground text-sm">
										{t("stats.iterations")}
									</div>
									<div className="font-bold font-mono text-2xl">
										{iterations}
									</div>
								</div>
								<div className="rounded-lg border bg-card p-3">
									<div className="text-muted-foreground text-sm">
										{t("stats.swaps")}
									</div>
									<div className="font-bold font-mono text-2xl">{swaps}</div>
								</div>
							</div>

							<div className="rounded-lg border bg-card p-4">
								<h4 className="mb-2 font-medium">{t("complexity.title")}</h4>
								<div className="space-y-2">
									<div className="grid grid-cols-4 gap-2 text-sm">
										<div className="font-medium">{t("complexity.case")}</div>
										<div className="font-medium">{t("complexity.best")}</div>
										<div className="font-medium">{t("complexity.average")}</div>
										<div className="font-medium">{t("complexity.worst")}</div>
									</div>
									<div className="grid grid-cols-4 gap-2 border-t pt-2 text-sm">
										<div>{t("complexity.time")}</div>
										<div className="font-mono">
											{currentAlgorithm.timeComplexity.best}
										</div>
										<div className="font-mono">
											{currentAlgorithm.timeComplexity.average}
										</div>
										<div className="font-mono">
											{currentAlgorithm.timeComplexity.worst}
										</div>
									</div>
									<div className="grid grid-cols-4 gap-2 border-t pt-2 text-sm">
										<div>{t("complexity.space")}</div>
										<div className="col-span-3 font-mono">
											{currentAlgorithm.spaceComplexity}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Explanation Section */}
						<div className="min-w-0 space-y-4">
							<h3 className="font-semibold text-lg">
								{t("explanation.title")}
							</h3>

							<Tabs defaultValue="steps">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="steps">
										{t("explanation.steps")}
									</TabsTrigger>
									<TabsTrigger value="cases">
										{t("explanation.cases")}
									</TabsTrigger>
									<TabsTrigger value="code">
										{t("explanation.code")}
									</TabsTrigger>
								</TabsList>

								<TabsContents>
									<TabsContent value="steps" className="mt-4 space-y-4">
										<ol className="ml-6 list-decimal space-y-2">
											{currentAlgorithm.steps.map((step, index) => (
												<li key={index}>{step}</li>
											))}
										</ol>
									</TabsContent>

									<TabsContent value="cases" className="mt-4 space-y-4">
										<div className="space-y-3">
											<div>
												<h4 className="font-medium">
													{t("complexity.best")} (
													{currentAlgorithm.timeComplexity.best})
												</h4>
												<p className="text-muted-foreground text-sm">
													{currentAlgorithm.bestCase}
												</p>
											</div>
											<div>
												<h4 className="font-medium">
													{t("complexity.average")} (
													{currentAlgorithm.timeComplexity.average})
												</h4>
												<p className="text-muted-foreground text-sm">
													{currentAlgorithm.averageCase}
												</p>
											</div>
											<div>
												<h4 className="font-medium">
													{t("complexity.worst")} (
													{currentAlgorithm.timeComplexity.worst})
												</h4>
												<p className="text-muted-foreground text-sm">
													{currentAlgorithm.worstCase}
												</p>
											</div>
										</div>
									</TabsContent>

									<TabsContent value="code" className="group relative mt-4">
										{highlightedAlgorithmCode}
										<RippleButton
											onClick={() => copyCode(getAlgorithmCode(algorithm))}
											variant="ghost"
											size="sm"
											className={cn(
												"absolute top-1 right-1 flex size-8 scale-0 items-center justify-center bg-background/60 p-0 transition-all duration-200 ease-snappy focus-visible:scale-100 focus-visible:opacity-100 touch-only:group-focus-within:scale-100 touch-only:group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100",
												copied === getAlgorithmCode(algorithm) &&
													"scale-100 opacity-100",
											)}
											type="button"
										>
											<div className="relative size-4">
												<Check
													className={cn(
														"absolute inset-0 scale-0 text-primary opacity-0 transition-all duration-200 ease-snappy",
														copied === getAlgorithmCode(algorithm) &&
															"scale-100 opacity-100",
													)}
												/>
												<Copy
													className={cn(
														"absolute inset-0 scale-100 opacity-100 transition-all duration-200 ease-snappy",
														copied === getAlgorithmCode(algorithm) &&
															"scale-0 opacity-0",
													)}
												/>
											</div>
										</RippleButton>
									</TabsContent>
								</TabsContents>
							</Tabs>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
