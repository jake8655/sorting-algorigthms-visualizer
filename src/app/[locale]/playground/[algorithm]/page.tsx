import { HexagonBackground } from "@/components/animate-ui/hexagon-background";
import PlaygroundState from "@/components/playground-state";
import { highlight } from "@/lib/highlight";
import { ALGORITHMS, type Algorithm, getAlgorithmCode } from "@/lib/utils";

export const dynamicParams = false;
export function generateStaticParams() {
	return ALGORITHMS.map((algorithm) => ({ algorithm }));
}

export default async function Playground({
	params,
}: {
	params: Promise<{ algorithm: Algorithm }>;
}) {
	const { algorithm } = (await params) as { algorithm: Algorithm };

	const highlightedAlgorithmCode = await highlight(
		getAlgorithmCode(algorithm),
		"ts",
	);

	return (
		<div className="relative flex items-center justify-center">
			<HexagonBackground className="absolute inset-0 z-0" />
			<PlaygroundState
				algorithm={algorithm}
				highlightedAlgorithmCode={highlightedAlgorithmCode}
			/>
		</div>
	);
}
