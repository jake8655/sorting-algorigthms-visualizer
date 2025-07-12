"use client";

import { type JSX, Suspense, useState } from "react";
import type { Algorithm } from "@/lib/utils";
import AlgorithmExplanation from "./algorithm-explanation";
import SortingVisualizer, { VisualizerSkeleton } from "./sorting-visualizer";

export default function PlaygroundState({
	algorithm,
	highlightedAlgorithmCode,
}: {
	algorithm: Algorithm;
	highlightedAlgorithmCode: JSX.Element;
}) {
	const [iterations, setIterations] = useState(0);
	const [swaps, setSwaps] = useState(0);

	return (
		<div className="pointer-events-none relative z-10 mx-4 mt-40 max-w-4xl md:mx-0">
			<Suspense fallback={<VisualizerSkeleton algorithm={algorithm} />}>
				<SortingVisualizer
					algorithm={algorithm}
					setIterations={setIterations}
					setSwaps={setSwaps}
				/>
			</Suspense>
			<AlgorithmExplanation
				algorithm={algorithm}
				highlightedAlgorithmCode={highlightedAlgorithmCode}
				iterations={iterations}
				swaps={swaps}
				className="pointer-events-auto my-16"
			/>
		</div>
	);
}
