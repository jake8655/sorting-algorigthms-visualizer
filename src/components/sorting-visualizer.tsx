"use client";

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
};

export default function SortingVisualizer() {
  const [data, setData] = useState<BarData[]>([]);
  const [originalData, setOriginalData] = useState<BarData[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubble");
  const svgRef = useRef<SVGSVGElement>(null);
  const sortingRef = useRef<{ cancel: boolean }>({ cancel: false });

  // Generate random data
  const generateRandomData = (count = 20) => {
    const newData: BarData[] = [];
    for (let i = 0; i < count; i++) {
      newData.push({
        value: Math.floor(Math.random() * 100) + 10,
        index: i,
        state: "default",
      });
    }
    setData([...newData]);
    setOriginalData([...newData]);
  };

  // Initialize data on component mount
  useEffect(() => {
    generateRandomData();
  }, []);

  // Draw the visualization whenever data changes
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const barWidth = (width / data.length) * 0.8;
    const _barPadding = (width / data.length) * 0.2;

    // Create a scale for x positions
    const xScale = d3.scaleLinear().domain([0, data.length]).range([0, width]);

    // Clear previous content if needed
    if (svg.selectAll("g").empty()) {
      svg.selectAll("*").remove();
    }

    // Update or create groups for each bar
    // @ts-expect-error bad types
    const bars = svg.selectAll("g").data(data, d => d.index);

    // Remove any exiting bars
    bars.exit().remove();

    // Add new bars
    const enterBars = bars
      .enter()
      .append("g")
      .attr("transform", (_d, i) => `translate(${xScale(i)}, 0)`);

    // Add rectangles to new groups
    enterBars
      .append("rect")
      .attr("y", d => height - (d.value * height) / 110)
      .attr("width", barWidth)
      .attr("height", d => (d.value * height) / 110)
      .attr("rx", 2)
      .attr("fill", getColorForState);

    // Add text labels to new groups
    enterBars
      .append("text")
      .text(d => d.value)
      .attr("x", barWidth / 2)
      .attr("y", d => height - (d.value * height) / 110 - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "currentColor");

    // Update existing bars with transitions
    const allBars = svg.selectAll("g");

    // Transition for the groups (position)
    allBars
      .transition()
      .duration(300)
      .attr("transform", (_d, i) => `translate(${xScale(i)}, 0)`);

    // Update rectangle colors
    allBars
      .select("rect")
      .transition()
      .duration(300)
      // @ts-expect-error bad types
      .attr("fill", getColorForState);

    // Update text positions
    allBars
      .select("text")
      // @ts-expect-error bad types
      .text(d => d.value)
      .transition()
      .duration(300)
      // @ts-expect-error bad types
      .attr("y", d => height - (d.value * height) / 110 - 5);

    function getColorForState(d: BarData) {
      switch (d.state) {
        case "comparing":
          return "#FF5733"; // Orange for comparing
        case "sorted":
          return "#33FF57"; // Green for sorted
        case "current":
          return "#FFD700"; // Gold for current element in insertion sort
        default:
          return "#3B82F6"; // Blue for default
      }
    }
  }, [data]);

  // Helper function to wait for a specified time
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to get animation delay based on speed
  const getDelay = () => 1000 - speed * 9;

  // Helper function to update data with transitions
  const updateData = (newData: BarData[]) => {
    setData([...newData]);
  };

  // Bubble sort implementation with animation
  const bubbleSort = async () => {
    if (isSorting && !isPaused) return;

    setIsSorting(true);
    setIsPaused(false);
    sortingRef.current.cancel = false;

    const newData = [...data];
    const n = newData.length;

    // If we're resuming, find where we left off
    let startJ = 0;
    const startI = 0;

    // Count how many elements are already sorted
    const sortedCount = newData.filter(item => item.state === "sorted").length;
    if (sortedCount > 0) {
      startJ = sortedCount;
    }

    // Main bubble sort loop
    for (let j = startJ; j < n - 1; j++) {
      let swapped = false;

      for (let i = 0; i < n - j - 1; i++) {
        // Check if sorting was cancelled
        if (sortingRef.current.cancel) return;

        // Check if sorting is paused
        while (isPaused) {
          await sleep(100);
          if (sortingRef.current.cancel) return;
        }

        // Mark the two elements being compared
        newData.forEach(item => {
          if (item.state === "comparing") item.state = "default";
        });

        newData[i]!.state = "comparing";
        newData[i + 1]!.state = "comparing";
        updateData(newData);

        // Wait for visualization to update
        await sleep(getDelay());

        // Check if swap is needed
        if (newData[i]!.value > newData[i + 1]!.value) {
          // Perform the swap in our data array
          const temp = newData[i]!;
          newData[i] = newData[i + 1]!;
          newData[i + 1] = temp;

          // Update visualization with the swap
          updateData(newData);
          swapped = true;

          // Wait for the animation to complete
          await sleep(getDelay());
        }
      }

      // Mark the last element as sorted
      newData[n - j - 1]!.state = "sorted";
      updateData(newData);

      if (!swapped) break;
    }

    // Mark all remaining elements as sorted
    newData.forEach(item => {
      if (item.state !== "sorted") item.state = "sorted";
    });
    updateData(newData);

    setIsSorting(false);
  };

  // Selection sort implementation with animation
  const selectionSort = async () => {
    if (isSorting && !isPaused) return;

    setIsSorting(true);
    setIsPaused(false);
    sortingRef.current.cancel = false;

    const newData = [...data];
    const n = newData.length;

    // Find where we left off if resuming
    let startI = 0;
    const sortedCount = newData.filter(item => item.state === "sorted").length;
    if (sortedCount > 0) {
      startI = sortedCount;
    }

    // Main selection sort loop
    for (let i = startI; i < n - 1; i++) {
      // Find the minimum element in the unsorted part
      let minIndex = i;

      // Mark current position
      newData[i]!.state = "comparing";
      updateData(newData);
      await sleep(getDelay());

      for (let j = i + 1; j < n; j++) {
        // Check if sorting was cancelled
        if (sortingRef.current.cancel) return;

        // Check if sorting is paused
        while (isPaused) {
          await sleep(100);
          if (sortingRef.current.cancel) return;
        }

        // Reset previous comparison
        newData.forEach((item, idx) => {
          if (idx !== i && idx !== minIndex && item.state !== "sorted") {
            item.state = "default";
          }
        });

        // Mark current element being compared
        newData[j]!.state = "comparing";
        updateData(newData);
        await sleep(getDelay());

        if (newData[j]!.value < newData[minIndex]!.value) {
          // Reset previous minimum
          if (minIndex !== i) {
            newData[minIndex]!.state = "default";
          }
          minIndex = j;
          newData[minIndex]!.state = "current";
          updateData(newData);
          await sleep(getDelay() / 2);
        } else {
          // Reset current comparison if not the new minimum
          newData[j]!.state = "default";
          updateData(newData);
        }
      }

      // Swap the found minimum element with the first element
      if (minIndex !== i) {
        const temp = newData[i]!;
        newData[i] = newData[minIndex]!;
        newData[minIndex] = temp;

        // Update visualization with the swap
        updateData(newData);
        await sleep(getDelay());
      }

      // Mark the element as sorted
      newData[i]!.state = "sorted";
      updateData(newData);
    }

    // Mark the last element as sorted
    newData[n - 1]!.state = "sorted";
    updateData(newData);

    setIsSorting(false);
  };

  // Insertion sort implementation with animation
  const insertionSort = async () => {
    if (isSorting && !isPaused) return;

    setIsSorting(true);
    setIsPaused(false);
    sortingRef.current.cancel = false;

    const newData = [...data];
    const n = newData.length;

    // Find where we left off if resuming
    let startI = 1;
    const sortedCount = newData.filter(item => item.state === "sorted").length;
    if (sortedCount > 0) {
      startI = sortedCount;
    }

    // Mark the first element as sorted initially
    if (startI === 1) {
      newData[0]!.state = "sorted";
      updateData(newData);
      await sleep(getDelay());
    }

    // Main insertion sort loop
    for (let i = startI; i < n; i++) {
      // Store the current element to be inserted
      const current = newData[i];
      current!.state = "current";
      updateData(newData);
      await sleep(getDelay());

      // Find the position to insert the current element
      let j = i - 1;

      while (j >= 0) {
        // Check if sorting was cancelled
        if (sortingRef.current.cancel) return;

        // Check if sorting is paused
        while (isPaused) {
          await sleep(100);
          if (sortingRef.current.cancel) return;
        }

        // Mark elements being compared
        newData[j]!.state = "comparing";
        updateData(newData);
        await sleep(getDelay());

        if (newData[j]!.value > current!.value) {
          // Shift elements to the right
          newData[j + 1] = newData[j]!;
          j--;

          // Update visualization with the shift
          updateData(newData);
          await sleep(getDelay());
        } else {
          // Reset comparison state
          newData[j]!.state = "sorted";
          break;
        }

        // Reset comparison state
        newData[j + 1]!.state = "sorted";
      }

      // Insert the current element at the correct position
      newData[j + 1] = current!;
      newData[j + 1]!.state = "sorted";

      // Update visualization with the insertion
      updateData(newData);
      await sleep(getDelay());
    }

    setIsSorting(false);
  };

  // Reset to original unsorted state
  const resetToOriginal = () => {
    sortingRef.current.cancel = true;
    setIsSorting(false);
    setIsPaused(false);

    // Create a deep copy of the original data with all states reset to default
    const resetData = originalData.map(item => ({
      ...item,
      state: "default" as const,
    }));

    setData([...resetData]);
  };

  // Generate new random data
  const generateNew = () => {
    sortingRef.current.cancel = true;
    setIsSorting(false);
    setIsPaused(false);
    generateRandomData();
  };

  // Toggle pause/resume
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Start sorting based on selected algorithm
  const startSorting = () => {
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
            />
          </div>

          <Select
            value={algorithm}
            onValueChange={setAlgorithm}
            disabled={isSorting && !isPaused}
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

      <div className="w-full border rounded-lg overflow-hidden bg-card">
        <svg ref={svgRef} width="100%" height="400" className="w-full"></svg>
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
