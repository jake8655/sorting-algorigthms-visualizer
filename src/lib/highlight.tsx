import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type JSX } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki";
import type { BundledLanguage } from "shiki/bundle/web";
import { cn } from "@/lib/utils";

export async function highlight(code: string, lang: BundledLanguage) {
	const out = await codeToHast(code, {
		lang,
		theme: "github-dark",
	});

	return toJsxRuntime(out, {
		Fragment,
		jsx,
		jsxs,
		components: {
			pre: (props) => {
				const { className, ...rest } = props;
				return (
					<pre
						data-custom-codeblock
						className={cn(
							className,
							"overflow-x-auto rounded-md bg-muted p-4 text-xs",
						)}
						{...rest}
					/>
				);
			},
		},
	}) as JSX.Element;
}
