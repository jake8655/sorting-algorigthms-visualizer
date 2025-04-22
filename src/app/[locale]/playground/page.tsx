import { HexagonBackground } from "@/components/animate-ui/hexagon-background";
import SortingVisualizer from "@/components/sorting-visualizer";

export default function Playground() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <HexagonBackground className="absolute inset-0" />

      <div className="pointer-events-none relative z-10 w-4xl">
        <SortingVisualizer />
      </div>
    </div>
  );
}
