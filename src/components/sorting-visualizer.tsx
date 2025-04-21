"use client";

import * as d3 from "d3";
import { Pause, Play, RefreshCw, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RippleButton } from "@/components/animate-ui/ripple-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { SlidingNumber } from "./animate-ui/sliding-number";

// Define the types for our data and animation states
type BarData = {
  value: number;
  index: number;
  state: "default" | "comparing" | "sorted" | "current";
  originalIndex: number; // To track original position
};

export default function SortingVisualizer({
  className,
}: {
  className?: string;
}) {
  const [arrayLength, setArrayLength] = useState(20);

  const [data, setData] = useState<BarData[]>([]);
  const [originalData, setOriginalData] = useState<BarData[]>([]);

  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseRef = useRef<boolean>(false);
  const cancelRef = useRef<boolean>(false);

  const [speed, setSpeed] = useState(50);
  // A ref is needed because the the state in useState would be encapsulated in the sorting algorithm closures
  const speedRef = useRef<number>(speed);

  const [algorithm, setAlgorithm] = useState<
    "bubble" | "selection" | "insertion" | "quicksort"
  >("bubble");

  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Generate random data
  const generateRandomData = (count: number) => {
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
    generateRandomData(arrayLength);
    return () => {
      // Cleanup any animations on unmount
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: Not needed with React Compiler (https://github.com/biomejs/biome/issues/5293)
  }, [generateRandomData, arrayLength]);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    // biome-ignore lint/correctness/useExhaustiveDependencies: This is an explicit effect
  }, [arrayLength]);

  // Draw the visualization whenever data changes
  useEffect(() => {
    if (!svgRef.current || data.length === 0) {
      // Optionally clear SVG if data becomes empty
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll("*").remove();
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight - 10; // Account for text above bars

    // Calculate bar dimensions based on current data length
    const barWidth = (width / data.length) * 0.8;
    const barPadding = (width / data.length) * 0.2;

    // --- D3 Update Pattern ---

    // Bind data to group elements (g) with class "bar"
    // Use originalIndex as the key function to track individual bars
    const bars = svg
      .selectAll<SVGGElement, BarData>(".bar") // Explicitly type selection
      .data(data, d => d.originalIndex.toString()); // Key must be a string

    // Exit selection: Elements that are no longer in the data
    bars
      .exit()
      .transition() // Start transition on exiting elements
      .duration(300) // Animation duration for exit
      .attr("opacity", 0) // Fade out
      .remove(); // Remove the element after the transition finishes

    // Enter selection: New elements that are in the data but not on screen
    const enterBars = bars
      .enter()
      .append("g") // Append a group for each bar
      .attr("class", "bar")
      .attr("opacity", 0); // Start invisible for the enter transition

    // Append rect and text to the entering groups
    enterBars
      .append("rect")
      .attr("width", barWidth) // Initial width
      .attr("rx", 2);

    enterBars
      .append("text")
      .attr("x", barWidth / 2) // Text horizontal position relative to group
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "currentColor");

    // Update + Enter selection: Elements that are on screen (either new or existing)
    // This is where you define the final state and transitions
    const mergedBars = enterBars.merge(bars); // Combine enter and update selections

    // Transition for the group (position and opacity)
    mergedBars
      .transition()
      .duration(300) // Animation duration for position and appearance
      .ease(d3.easeCubicInOut) // Add easing for smoother motion
      // Use the index 'i' from the *current* data array for the position
      .attr(
        "transform",
        (_d, i) => `translate(${i * (barWidth + barPadding)}, 0)`,
      )
      .attr("opacity", 1); // Fade in new elements

    // Transition for the rectangle within the group (height, y-position, color)
    mergedBars
      .select("rect")
      .transition()
      .duration(300) // Match group duration
      .ease(d3.easeCubicInOut)
      .attr("y", d => height - (d.value * height) / 110) // Animate from old y to new y
      .attr("height", d => (d.value * height) / 110) // Animate from old height to new height
      .attr("fill", d => {
        // Animate color changes
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

    // Transition for the text within the group (y-position and text content)
    mergedBars
      .select("text")
      .transition()
      .duration(300) // Match group duration
      .ease(d3.easeCubicInOut)
      .text(d => d.value) // Update text content (instantly)
      .attr("y", d => height - (d.value * height) / 110 - 5); // Animate text position
  }, [data]); // Rerun effect when data changes

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
  const getDelay = () => Math.max(50, 1000 - speedRef.current * 9);

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

  // Quicksort implementation with animation
  const quickSort = async () => {
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

    // Recursive quicksort function
    const quickSortRecursive = async (left: number, right: number) => {
      if (cancelRef.current) {
        return;
      }

      if (left < right) {
        // Partition the array
        await medianOfThree(left, right);

        const pivotIndex = await partition(left, right);

        // Mark pivot as sorted
        workingData[pivotIndex]!.state = "sorted";
        setData([...workingData]);
        await sleep(getDelay());

        // Recursively sort the sub-arrays
        await quickSortRecursive(left, pivotIndex - 1);
        await quickSortRecursive(pivotIndex + 1, right);
      } else if (left === right) {
        // Single element is already sorted
        workingData[left]!.state = "sorted";
        setData([...workingData]);
        await sleep(getDelay() / 2);
      }
    };

    // Partition function for quicksort
    const partition = async (left: number, right: number) => {
      const pivotValue = workingData[right]!.value;
      let i = left - 1;

      // Highlight the pivot
      workingData[right]!.state = "current";
      setData([...workingData]);
      await sleep(getDelay());

      for (let j = left; j < right; j++) {
        if (cancelRef.current) {
          return left;
        }

        // Mark current element being compared
        workingData[j]!.state = "comparing";
        setData([...workingData]);
        await sleep(getDelay());

        if (workingData[j]!.value < pivotValue) {
          i++;

          // Highlight elements to be swapped
          if (i !== j) {
            workingData[i]!.state = "comparing";
            setData([...workingData]);
            await sleep(getDelay());

            // Swap elements
            const temp = workingData[i]!;
            workingData[i] = workingData[j]!;
            workingData[j] = temp;

            setData([...workingData]);
            await sleep(getDelay());
          }
        }

        // Reset current element state
        workingData[j]!.state = "default";
        setData([...workingData]);
      }

      // Swap pivot with element at i+1
      i++;

      // Highlight elements to be swapped
      workingData[i]!.state = "comparing";
      setData([...workingData]);
      await sleep(getDelay());

      // Perform the swap
      const temp = workingData[i]!;
      workingData[i] = workingData[right]!;
      workingData[right] = temp;

      // Update visualization
      setData([...workingData]);
      await sleep(getDelay());

      // Reset states except for the pivot position
      for (let j = left; j <= right; j++) {
        if (j !== i) {
          workingData[j]!.state = "default";
        }
      }

      setData([...workingData]);
      await sleep(getDelay() / 2);

      return i;
    };

    const medianOfThree = async (left: number, right: number) => {
      const mid = Math.floor((left + right) / 2);

      // Sort the three elements
      workingData[left]!.state = "comparing";
      workingData[mid]!.state = "comparing";
      setData([...workingData]);
      await sleep(getDelay());
      if (workingData[left]!.value > workingData[mid]!.value) {
        const temp = workingData[left]!;
        workingData[left] = workingData[mid]!;
        workingData[mid] = temp;
      }
      workingData[left]!.state = "default";
      workingData[mid]!.state = "default";
      setData([...workingData]);
      await sleep(getDelay());

      workingData[left]!.state = "comparing";
      workingData[right]!.state = "comparing";
      setData([...workingData]);
      await sleep(getDelay());
      if (workingData[left]!.value > workingData[right]!.value) {
        const temp = workingData[left]!;
        workingData[left] = workingData[right]!;
        workingData[right] = temp;
      }
      workingData[left]!.state = "default";
      workingData[right]!.state = "default";
      setData([...workingData]);
      await sleep(getDelay());

      workingData[mid]!.state = "comparing";
      workingData[right]!.state = "comparing";
      setData([...workingData]);
      await sleep(getDelay());
      if (workingData[mid]!.value > workingData[right]!.value) {
        const temp = workingData[mid]!;
        workingData[mid] = workingData[right]!;
        workingData[right] = temp;
      }
      workingData[mid]!.state = "default";
      workingData[right]!.state = "default";
      setData([...workingData]);
      await sleep(getDelay());

      workingData[mid]!.state = "comparing";
      workingData[right]!.state = "comparing";
      setData([...workingData]);
      await sleep(getDelay());
      const temp = workingData[mid]!;
      workingData[mid] = workingData[right]!;
      workingData[right] = temp;
      workingData[mid]!.state = "default";
      workingData[right]!.state = "default";
      setData([...workingData]);
      await sleep(getDelay());

      return right;
    };

    await quickSortRecursive(0, n - 1);

    // Mark all elements as sorted when done
    workingData = workingData.map(item => ({
      ...item,
      state: "sorted",
    }));
    setData([...workingData]);
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
    generateRandomData(arrayLength);
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

    switch (algorithm) {
      case "bubble":
        bubbleSort();
        break;
      case "selection":
        selectionSort();
        break;
      case "insertion":
        insertionSort();
        break;
      case "quicksort":
        quickSort();
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {!isSorting ? (
            <RippleButton
              onClick={startSorting}
              variant="default"
              className="pointer-events-auto"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Sorting
            </RippleButton>
          ) : (
            <RippleButton
              onClick={togglePause}
              variant={isPaused ? "default" : "secondary"}
              className="pointer-events-auto"
            >
              {isPaused ? (
                <Play className="mr-2 h-4 w-4" />
              ) : (
                <Pause className="mr-2 h-4 w-4" />
              )}
              {isPaused ? "Resume" : "Pause"}
            </RippleButton>
          )}

          <RippleButton
            onClick={resetToOriginal}
            variant="outline"
            className="pointer-events-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </RippleButton>

          <RippleButton
            onClick={generateNew}
            variant="outline"
            className="pointer-events-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            New Data
          </RippleButton>
        </div>

        <div className="flex items-center gap-4">
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="text-sm">Speed:</span>
            <Slider
              value={[speed]}
              onValueChange={value => {
                setSpeed(value[0]!);
                speedRef.current = value[0]!;
              }}
              min={1}
              max={100}
              step={1}
              className="w-32"
              disabled={!isPaused && isSorting}
            />
            <SlidingNumber number={speed} />
          </div>

          <Select
            value={algorithm}
            onValueChange={val =>
              setAlgorithm(val as "bubble" | "selection" | "insertion")
            }
            disabled={isSorting}
          >
            <SelectTrigger className="pointer-events-auto w-[180px]">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              <SelectItem value="selection">Selection Sort</SelectItem>
              <SelectItem value="insertion">Insertion Sort</SelectItem>
              <SelectItem value="quicksort">Quick Sort</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pointer-events-auto flex min-h-[550px] w-full items-end justify-center rounded-lg border bg-card/50 p-4">
        <svg ref={svgRef} height="530" className="w-[calc(100%-16px)]"></svg>
      </div>

      <div className="mt-2 flex flex-wrap gap-4">
        <div className="pointer-events-auto flex items-center gap-1">
          <div className="h-4 w-4 rounded-sm bg-[#3B82F6]"></div>
          <span className="text-sm">Unsorted</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-1">
          <div className="h-4 w-4 rounded-sm bg-[#FF5733]"></div>
          <span className="text-sm">Comparing</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-1">
          <div className="h-4 w-4 rounded-sm bg-[#FFD700]"></div>
          <span className="text-sm">
            {algorithm === "quicksort" ? "Pivot" : "Current Element"}
          </span>
        </div>
        <div className="pointer-events-auto flex items-center gap-1">
          <div className="h-4 w-4 rounded-sm bg-[#33FF57]"></div>
          <span className="text-sm">Sorted</span>
        </div>

        <div className="pointer-events-auto ml-auto flex items-center gap-2">
          <span className="text-sm">Length:</span>
          <Slider
            value={[arrayLength]}
            onValueChange={value => setArrayLength(value[0]!)}
            min={10}
            max={100}
            step={1}
            className="w-32"
            disabled={isSorting}
          />
          <SlidingNumber number={arrayLength} />
        </div>
      </div>
    </div>
  );
}
