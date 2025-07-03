import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { HexagonBackground } from "@/components/animate-ui/hexagon-background";
import PlaygroundState from "@/components/playground-state";
import { getQueryClient } from "@/lib/get-query-client";
import { codeHighlightOptions, loadSearchParams } from "@/lib/utils";

export default async function Playground({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const { algorithm } = await loadSearchParams(searchParams);
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(codeHighlightOptions(algorithm));

	return (
		<div className="relative flex items-center justify-center">
			<HexagonBackground className="absolute inset-0" />

			<HydrationBoundary state={dehydrate(queryClient)}>
				<PlaygroundState />
			</HydrationBoundary>
		</div>
	);
}
