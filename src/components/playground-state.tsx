"use client";

import { useQueryState } from "nuqs";
import { useState } from "react";
import { playgroundSearchParams } from "@/lib/utils";
import AlgorithmExplanation from "./algorithm-explanation";
import SortingVisualizer from "./sorting-visualizer";

export default function PlaygroundState() {
	const [algorithm, setAlgorithm] = useQueryState(
		"algorithm",
		playgroundSearchParams.algorithm,
	);
	const [iterations, setIterations] = useState(0);
	const [swaps, setSwaps] = useState(0);

	return (
		<div className="pointer-events-none relative z-10 mx-4 mt-40 max-w-4xl md:mx-0">
			<SortingVisualizer
				algorithm={algorithm}
				setAlgorithm={setAlgorithm}
				setIterations={setIterations}
				setSwaps={setSwaps}
			/>
			<AlgorithmExplanation
				algorithm={algorithm}
				iterations={iterations}
				swaps={swaps}
				className="pointer-events-auto my-16"
			/>
		</div>
	);
}
