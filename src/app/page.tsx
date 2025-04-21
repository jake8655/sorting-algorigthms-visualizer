import SortingVisualizer from "@/components/sorting-visualizer";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Sorting Algorithm Visualization
        </h1>
        <SortingVisualizer />
      </div>
    </main>
  );
}
