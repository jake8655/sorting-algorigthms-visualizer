"use client";

import { useTranslations } from "next-intl";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AlgorithmExplanationProps {
  algorithm: "bubble" | "selection" | "insertion" | "quicksort";
  iterations: number;
  swaps: number;
  className?: string;
}

export default function AlgorithmExplanation({
  algorithm,
  iterations,
  swaps,
  className,
}: AlgorithmExplanationProps) {
  const t = useTranslations("algorithm-explanation");

  const algorithmData = {
    bubble: {
      title: t("bubble.title"),
      description: t("bubble.description"),
      steps: [
        t("bubble.steps.0"),
        t("bubble.steps.1"),
        t("bubble.steps.2"),
        t("bubble.steps.3"),
      ],
      timeComplexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
      },
      spaceComplexity: "O(1)",
      bestCase: t("bubble.best-case"),
      averageCase: t("bubble.average-case"),
      worstCase: t("bubble.worst-case"),
    },
    selection: {
      title: t("selection.title"),
      description: t("selection.description"),
      steps: [
        t("selection.steps.0"),
        t("selection.steps.1"),
        t("selection.steps.2"),
        t("selection.steps.3"),
      ],
      timeComplexity: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
      },
      spaceComplexity: "O(1)",
      bestCase: t("selection.best-case"),
      averageCase: t("selection.average-case"),
      worstCase: t("selection.worst-case"),
    },
    insertion: {
      title: t("insertion.title"),
      description: t("insertion.description"),
      steps: [
        t("insertion.steps.0"),
        t("insertion.steps.1"),
        t("insertion.steps.2"),
        t("insertion.steps.3"),
      ],
      timeComplexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
      },
      spaceComplexity: "O(1)",
      bestCase: t("insertion.best-case"),
      averageCase: t("insertion.average-case"),
      worstCase: t("insertion.worst-case"),
    },
    quicksort: {
      title: t("quicksort.title"),
      description: t("quicksort.description"),
      steps: [
        t("quicksort.steps.0"),
        t("quicksort.steps.1"),
        t("quicksort.steps.2"),
        t("quicksort.steps.3"),
        t("quicksort.steps.4"),
      ],
      timeComplexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
      },
      spaceComplexity: "O(log n)",
      bestCase: t("quicksort.best-case"),
      averageCase: t("quicksort.average-case"),
      worstCase: t("quicksort.worst-case"),
    },
  };

  const currentAlgorithm = algorithmData[algorithm];

  return (
    <div className={cn("w-full", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{currentAlgorithm.title}</CardTitle>
          <CardDescription>{currentAlgorithm.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Stats Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t("stats.title")}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-muted-foreground text-sm">
                    {t("stats.iterations")}
                  </div>
                  <div className="font-bold font-mono text-2xl">
                    {iterations}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="text-muted-foreground text-sm">
                    {t("stats.swaps")}
                  </div>
                  <div className="font-bold font-mono text-2xl">{swaps}</div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-medium">{t("complexity.title")}</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="font-medium">{t("complexity.case")}</div>
                    <div className="font-medium">{t("complexity.best")}</div>
                    <div className="font-medium">{t("complexity.average")}</div>
                    <div className="font-medium">{t("complexity.worst")}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 border-t pt-2 text-sm">
                    <div>{t("complexity.time")}</div>
                    <div className="font-mono">
                      {currentAlgorithm.timeComplexity.best}
                    </div>
                    <div className="font-mono">
                      {currentAlgorithm.timeComplexity.average}
                    </div>
                    <div className="font-mono">
                      {currentAlgorithm.timeComplexity.worst}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 border-t pt-2 text-sm">
                    <div>{t("complexity.space")}</div>
                    <div className="col-span-3 font-mono">
                      {currentAlgorithm.spaceComplexity}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {t("explanation.title")}
              </h3>

              <Tabs defaultValue="steps">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="steps">
                    {t("explanation.steps")}
                  </TabsTrigger>
                  <TabsTrigger value="cases">
                    {t("explanation.cases")}
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    {t("explanation.code")}
                  </TabsTrigger>
                </TabsList>

                <TabsContents>
                  <TabsContent value="steps" className="mt-4 space-y-4">
                    <ol className="ml-6 list-decimal space-y-2">
                      {currentAlgorithm.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </TabsContent>

                  <TabsContent value="cases" className="mt-4 space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">
                          {t("complexity.best")} (
                          {currentAlgorithm.timeComplexity.best})
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {currentAlgorithm.bestCase}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {t("complexity.average")} (
                          {currentAlgorithm.timeComplexity.average})
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {currentAlgorithm.averageCase}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {t("complexity.worst")} (
                          {currentAlgorithm.timeComplexity.worst})
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {currentAlgorithm.worstCase}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="mt-4">
                    <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                      <code>{getAlgorithmCode(algorithm)}</code>
                    </pre>
                  </TabsContent>
                </TabsContents>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getAlgorithmCode(algorithm: string): string {
  switch (algorithm) {
    case "bubble":
      return `function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // If no swapping occurred in this pass,
    // array is sorted
    if (!swapped) break;
  }

  return arr;
}`;
    case "selection":
      return `function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    // Find minimum element in unsorted part
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap found minimum with first element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}`;
    case "insertion":
      return `function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    // Store current element to be inserted
    let key = arr[i];
    let j = i - 1;

    // Move elements greater than key
    // to one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    // Insert the key at correct position
    arr[j + 1] = key;
  }

  return arr;
}`;
    case "quicksort":
      return `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Find pivot element such that
    // elements smaller than pivot are on the left
    // elements greater than pivot are on the right
    const pivotIndex = partition(arr, low, high);

    // Recursively sort elements before and after pivot
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }

  return arr;
}

function partition(arr, low, high) {
  // Choose rightmost element as pivot
  const pivot = arr[high];
  let i = low - 1;

  // Compare each element with pivot
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Place pivot in its final position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`;
    default:
      return "";
  }
}
