"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { getQueryClient } from "@/lib/get-query-client";

export default function Providers({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>{children}</NuqsAdapter>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}
