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

// Define the types for our data and animation states
type BarData = {
  value: number;
  index: number;
  state: "default" | "comparing" | "sorted";
};

export default function SortingVisualizer() {
  const [data, setData] = useState<BarData[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubble");
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);

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
    setData(newData);
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
    const barPadding = (width / data.length) * 0.2;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create a group for each bar
    const bars = svg
      .selectAll("g")
      .data(data, d => d.index)
      .enter()
      .append("g")
      .attr(
        "transform",
        (_d, i) => `translate(${i * (barWidth + barPadding)}, 0)`,
      );

    // Add rectangles to each group
    bars
      .append("rect")
      .attr("y", d => height - (d.value * height) / 110)
      .attr("width", barWidth)
      .attr("height", d => (d.value * height) / 110)
      .attr("rx", 2)
      .attr("fill", d => {
        if (d.state === "comparing") return "#FF5733"; // Orange for comparing
        if (d.state === "sorted") return "#33FF57"; // Green for sorted
        return "#3B82F6"; // Blue for default
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

  // Bubble sort implementation with animation
  const bubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);

    const newData = [...data];
    const n = newData.length;
    let swapped = false;

    // Function to animate a single comparison and potential swap
    const animateStep = (i: number) => {
      return new Promise<boolean>(resolve => {
        // Mark the two elements being compared
        setData(current => {
          const updated = [...current];
          // Reset previous comparisons
          updated.forEach(item => {
            if (item.state === "comparing") item.state = "default";
          });

          if (i < n - 1) {
            updated[i]!.state = "comparing";
            updated[i + 1]!.state = "comparing";
          }
          return updated;
        });

        // Wait for visualization to update
        setTimeout(
          () => {
            // Check if swap is needed
            if (newData[i]!.value > newData[i + 1]!.value) {
              // Perform the swap in our data array
              const temp = newData[i]!;
              newData[i] = newData[i + 1]!;
              newData[i + 1] = temp;

              // Animate the swap
              setData([...newData]);
              swapped = true;
            }

            // Wait for the animation to complete
            setTimeout(
              () => {
                resolve(swapped);
              },
              1000 - speed * 9,
            );
          },
          1000 - speed * 9,
        );
      });
    };

    // Main bubble sort loop
    for (let j = 0; j < n - 1; j++) {
      swapped = false;

      for (let i = 0; i < n - j - 1; i++) {
        await animateStep(i);
      }

      // Mark the last element as sorted
      setData(current => {
        const updated = [...current];
        updated[n - j - 1]!.state = "sorted";
        return updated;
      });

      if (!swapped) break;
    }

    // Mark all remaining elements as sorted
    setData(current => {
      return current.map(item => ({
        ...item,
        state: "sorted",
      }));
    });

    setIsSorting(false);
  };

  // Reset the visualization
  const resetVisualization = () => {
    if (isSorting) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setIsSorting(false);
    }
    generateRandomData();
  };

  // Start sorting based on selected algorithm
  const startSorting = () => {
    if (algorithm === "bubble") {
      bubbleSort();
    }
    // Add other algorithms here in the future
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={startSorting} disabled={isSorting} variant="default">
            Start Sorting
          </Button>
          <Button onClick={resetVisualization} variant="outline">
            Reset
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
            disabled={isSorting}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              {/* Add more algorithms here in the future */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full border rounded-lg overflow-hidden bg-card">
        <svg ref={svgRef} width="100%" height="400" className="w-full"></svg>
      </div>

      <div className="flex gap-2 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm bg-[#3B82F6]"></div>
          <span className="text-sm">Unsorted</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm bg-[#FF5733]"></div>
          <span className="text-sm">Comparing</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm bg-[#33FF57]"></div>
          <span className="text-sm">Sorted</span>
        </div>
      </div>
    </div>
  );
}
