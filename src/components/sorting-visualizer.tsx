"use client";

// TODO: fix speed change not being reflected when changed during pause

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RefreshCw, RotateCcw } from "lucide-react";

// Define the types for our data and animation states
type BarData = {
  value: number;
  index: number;
  state: "default" | "comparing" | "sorted" | "current";
  originalIndex: number; // To track original position
};

export default function SortingVisualizer() {
  const [data, setData] = useState<BarData[]>([]);
  const [originalData, setOriginalData] = useState<BarData[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubble");
  const svgRef = useRef<SVGSVGElement>(null);
  const pauseRef = useRef<boolean>(false);
  const cancelRef = useRef<boolean>(false);
  const animationFrameId = useRef<number | null>(null);

  // Generate random data
  const generateRandomData = (count = 20) => {
    const newData: BarData[] = [];
    for (let i = 0; i < count; i++) {
      newData.push({
        value: Math.floor(Math.random() * 90) + 10,
        index: i,
        state: "default",
        originalIndex: i,
      });
    }
    setData([...newData]);
    setOriginalData(JSON.parse(JSON.stringify(newData)));
  };

  // Initialize data on component mount
  useEffect(() => {
    generateRandomData();
    return () => {
      // Cleanup any animations on unmount
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Draw the visualization whenever data changes
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight - 10;
    const barWidth = (width / data.length) * 0.8;
    const barPadding = (width / data.length) * 0.2;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create bars with transitions
    const bars = svg
      .selectAll(".bar")
      // @ts-expect-error bad types
      .data(data, d => d.originalIndex) // Use originalIndex for data binding
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr(
        "transform",
        (_d, i) => `translate(${i * (barWidth + barPadding)}, 0)`,
      );

    // Add rectangles
    bars
      .append("rect")
      .attr("y", d => height - (d.value * height) / 110)
      .attr("width", barWidth)
      .attr("height", d => (d.value * height) / 110)
      .attr("rx", 2)
      .attr("fill", d => {
        switch (d.state) {
          case "comparing":
            return "#FF5733"; // Orange for comparing
          case "sorted":
            return "#33FF57"; // Green for sorted
          case "current":
            return "#FFD700"; // Gold for current element
          default:
            return "#3B82F6"; // Blue for default
        }
      });

    // Add text labels
    bars
      .append("text")
      .text(d => d.value)
      .attr("x", barWidth / 2)
      .attr("y", d => height - (d.value * height) / 110 - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "currentColor");
  }, [data]);

  // Helper function to wait for a specified time
  const sleep = async (ms: number) => {
    return new Promise<void>(resolve => {
      const startTime = Date.now();

      const checkPause = () => {
        if (cancelRef.current) {
          resolve();
          return;
        }

        if (pauseRef.current) {
          animationFrameId.current = requestAnimationFrame(checkPause);
          return;
        }

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= ms) {
          resolve();
        } else {
          animationFrameId.current = requestAnimationFrame(checkPause);
        }
      };

      checkPause();
    });
  };

  // Helper function to get animation delay based on speed
  const getDelay = () => Math.max(50, 1000 - speed * 9);

  // Bubble sort implementation with animation
  const bubbleSort = async () => {
    if (isSorting) return;

    setIsSorting(true);
    pauseRef.current = false;
    cancelRef.current = false;

    // Create a working copy of the data
    let workingData = [...data];
    const n = workingData.length;

    // Reset all states
    workingData = workingData.map(item => ({
      ...item,
      state: "default",
    }));

    setData([...workingData]);
    await sleep(getDelay() / 2);

    // Main bubble sort loop
    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        if (cancelRef.current) {
          setIsSorting(false);
          return;
        }

        // Mark elements being compared
        workingData[j]!.state = "comparing";
        workingData[j + 1]!.state = "comparing";
        setData([...workingData]);
        await sleep(getDelay());

        // Compare and swap if needed
        if (workingData[j]!.value > workingData[j + 1]!.value) {
          // Swap elements
          const temp = workingData[j]!;
          workingData[j] = workingData[j + 1]!;
          workingData[j + 1] = temp;
          swapped = true;

          // Update visualization
          setData([...workingData]);
          await sleep(getDelay());
        }

        // Reset comparison state
        workingData[j]!.state = "default";
        workingData[j + 1]!.state = j === n - i - 2 ? "sorted" : "default";
        setData([...workingData]);
      }

      if (!swapped) {
        // If no swaps were made, the array is sorted
        break;
      }
    }

    // Mark all elements as sorted
    workingData = workingData.map(item => ({
      ...item,
      state: "sorted",
    }));
    setData([...workingData]);

    setIsSorting(false);
  };

  // Selection sort implementation with animation
  const selectionSort = async () => {
    if (isSorting) return;

    setIsSorting(true);
    pauseRef.current = false;
    cancelRef.current = false;

    // Create a working copy of the data
    let workingData = [...data];
    const n = workingData.length;

    // Reset all states
    workingData = workingData.map(item => ({
      ...item,
      state: "default",
    }));

    setData([...workingData]);
    await sleep(getDelay() / 2);

    // Main selection sort loop
    for (let i = 0; i < n - 1; i++) {
      if (cancelRef.current) {
        setIsSorting(false);
        return;
      }

      // Assume the minimum is the first unsorted element
      let minIdx = i;
      workingData[i]!.state = "comparing";
      setData([...workingData]);
      await sleep(getDelay());

      // Find the minimum element in the unsorted part
      for (let j = i + 1; j < n; j++) {
        if (cancelRef.current) {
          setIsSorting(false);
          return;
        }

        // Mark current element being compared
        workingData[j]!.state = "comparing";
        setData([...workingData]);
        await sleep(getDelay());

        if (workingData[j]!.value < workingData[minIdx]!.value) {
          // Reset previous minimum if it's not the initial position
          if (minIdx !== i) {
            workingData[minIdx]!.state = "default";
          }

          minIdx = j;
          workingData[j]!.state = "current"; // Mark as current minimum
        } else {
          // Reset if not the minimum
          workingData[j]!.state = "default";
        }

        setData([...workingData]);
        await sleep(getDelay() / 2);
      }

      // Swap the found minimum with the first unsorted element
      if (minIdx !== i) {
        // Reset states before swap
        workingData[i]!.state = "comparing";
        workingData[minIdx]!.state = "comparing";
        setData([...workingData]);
        await sleep(getDelay());

        // Perform swap
        const temp = workingData[i]!;
        workingData[i] = workingData[minIdx]!;
        workingData[minIdx] = temp;

        // Update visualization
        setData([...workingData]);
        await sleep(getDelay());
      }

      // Mark current position as sorted
      workingData[i]!.state = "sorted";

      // Reset any remaining comparing states
      for (let j = i + 1; j < n; j++) {
        if (
          workingData[j]!.state === "comparing" ||
          workingData[j]!.state === "current"
        ) {
          workingData[j]!.state = "default";
        }
      }

      setData([...workingData]);
      await sleep(getDelay() / 2);
    }

    // Mark the last element as sorted
    workingData[n - 1]!.state = "sorted";
    setData([...workingData]);

    setIsSorting(false);
  };

  // Insertion sort implementation with animation
  const insertionSort = async () => {
    if (isSorting) return;

    setIsSorting(true);
    pauseRef.current = false;
    cancelRef.current = false;

    // Create a working copy of the data
    let workingData = [...data];
    const n = workingData.length;

    // Reset all states
    workingData = workingData.map(item => ({
      ...item,
      state: "default",
    }));

    // Mark the first element as sorted initially
    workingData[0]!.state = "sorted";
    setData([...workingData]);
    await sleep(getDelay());

    // Main insertion sort loop
    for (let i = 1; i < n; i++) {
      if (cancelRef.current) {
        setIsSorting(false);
        return;
      }

      // Store the current element to be inserted
      const key = workingData[i]!.value;
      const currentItem = { ...workingData[i]! };
      currentItem.state = "comparing";

      // Mark current element
      workingData[i]!.state = "comparing";
      setData([...workingData]);
      await sleep(getDelay());

      // Find the position to insert the current element
      let j = i - 1;

      // Compare with each element in the sorted part
      while (j >= 0 && workingData[j]!.value > key) {
        if (cancelRef.current) {
          setIsSorting(false);
          return;
        }

        const temp = workingData[j]!;
        workingData[j] = { ...currentItem, state: "current" };

        // Mark element being compared
        setData([...workingData]);

        // Shift element to the right
        workingData[j + 1] = { ...temp, state: "sorted" };

        j--;

        // Update visualization with the shift
        setData([...workingData]);
        await sleep(getDelay());
      }

      // Insert the current element at the correct position
      workingData[j + 1] = { ...currentItem, state: "sorted" };

      // Update visualization with the insertion
      setData([...workingData]);
      await sleep(getDelay());
    }

    setIsSorting(false);
  };

  // Reset to original unsorted state
  const resetToOriginal = () => {
    // Cancel any ongoing sorting
    cancelRef.current = true;
    pauseRef.current = false;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    setIsSorting(false);
    setIsPaused(false);

    // Reset to original data with default states
    const resetData = originalData.map(item => ({
      ...item,
      state: "default" as const,
    }));

    setData([...resetData]);
  };

  // Generate new random data
  const generateNew = () => {
    // Cancel any ongoing sorting
    cancelRef.current = true;
    pauseRef.current = false;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    setIsSorting(false);
    setIsPaused(false);

    // Generate new data
    generateRandomData();
  };

  // Toggle pause/resume
  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    pauseRef.current = newPausedState;
  };

  // Start sorting based on selected algorithm
  const startSorting = () => {
    if (isSorting) return;

    if (algorithm === "bubble") {
      bubbleSort();
    } else if (algorithm === "selection") {
      selectionSort();
    } else if (algorithm === "insertion") {
      insertionSort();
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
          {!isSorting ? (
            <Button onClick={startSorting} variant="default">
              <Play className="w-4 h-4 mr-2" />
              Start Sorting
            </Button>
          ) : (
            <Button
              onClick={togglePause}
              variant={isPaused ? "default" : "secondary"}
            >
              {isPaused ? (
                <Play className="w-4 h-4 mr-2" />
              ) : (
                <Pause className="w-4 h-4 mr-2" />
              )}
              {isPaused ? "Resume" : "Pause"}
            </Button>
          )}

          <Button onClick={resetToOriginal} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button onClick={generateNew} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            New Data
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Speed:</span>
            <Slider
              value={[speed]}
              onValueChange={value => setSpeed(value[0]!)}
              min={1}
              max={100}
              step={1}
              className="w-32"
              disabled={!isPaused && isSorting}
            />
          </div>

          <Select
            value={algorithm}
            onValueChange={setAlgorithm}
            disabled={isSorting}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              <SelectItem value="selection">Selection Sort</SelectItem>
              <SelectItem value="insertion">Insertion Sort</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full border rounded-lg bg-card min-h-[550px] flex items-end justify-center p-4">
        <svg ref={svgRef} height="530" className="w-[calc(100%-16px)]"></svg>
      </div>

      <div className="flex gap-4 mt-2 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm bg-[#3B82F6]"></div>
          <span className="text-sm">Unsorted</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm bg-[#FF5733]"></div>
          <span className="text-sm">Comparing</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm bg-[#FFD700]"></div>
          <span className="text-sm">Current Element</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm bg-[#33FF57]"></div>
          <span className="text-sm">Sorted</span>
        </div>
      </div>
    </div>
  );
}
