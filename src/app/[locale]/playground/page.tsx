"use client";

import { useState } from "react";
import AlgorithmExplanation from "@/components/algorithm-explanation";
import { HexagonBackground } from "@/components/animate-ui/hexagon-background";
import SortingVisualizer from "@/components/sorting-visualizer";

export default function Playground() {
  const [algorithm, setAlgorithm] = useState<
    "bubble" | "selection" | "insertion" | "quicksort"
  >("bubble");
  const [iterations, setIterations] = useState(0);
  const [swaps, setSwaps] = useState(0);

  return (
    <div>
      <div className="relative flex min-h-[90vh] items-center justify-center">
        <HexagonBackground className="absolute inset-0" />

        <div className="pointer-events-none relative z-10 mt-40 w-4xl">
          <SortingVisualizer
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            setIterations={setIterations}
            setSwaps={setSwaps}
          />
        </div>
      </div>

      <div className="relative flex justify-center">
        <HexagonBackground className="absolute inset-0" />
        <div className="pointer-events-none relative z-10 my-16 w-4xl">
          <AlgorithmExplanation
            algorithm={algorithm}
            iterations={iterations}
            swaps={swaps}
            className="pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
}
