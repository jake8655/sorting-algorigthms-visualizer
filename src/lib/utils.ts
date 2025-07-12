import { queryOptions } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { createLoader, parseAsInteger } from "nuqs/server";
import { twMerge } from "tailwind-merge";
import { highlight } from "./highlight";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const ALGORITHMS = [
	"bubble",
	"selection",
	"insertion",
	"quicksort",
] as const;
export type Algorithm = (typeof ALGORITHMS)[number];

export const playgroundSearchParams = {
	speed: parseAsInteger.withDefault(50),
	length: parseAsInteger.withDefault(20),
};
export const loadSearchParams = createLoader(playgroundSearchParams);

export function codeHighlightOptions(algorithm: Algorithm) {
	return queryOptions({
		queryKey: ["code-highlight", algorithm],
		queryFn: () => {
			return highlight(getAlgorithmCode(algorithm), "ts");
		},
	});
}

export function getAlgorithmCode(algorithm: Algorithm): string {
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
