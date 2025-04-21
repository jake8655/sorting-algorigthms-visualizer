import { HexagonBackground } from "@/components/animate-ui/hexagon-background";
import SortingVisualizer from "@/components/sorting-visualizer";

export default async function Home() {
  return (
    <HexagonBackground className="absolute inset-0 flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 w-full max-w-5xl">
        <h1 className="mb-6 text-center font-bold text-3xl">
          Sorting Algorithm Visualization
        </h1>
        <SortingVisualizer />
      </div>
    </HexagonBackground>
  );
}
