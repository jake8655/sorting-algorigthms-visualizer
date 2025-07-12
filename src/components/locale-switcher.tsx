"use client";

import { Globe } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { type Locale, useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useIsMobile } from "@/hooks";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export default function LocaleSwitcher({ className }: { className?: string }) {
	const t = useTranslations("locale-switcher");
	const locale = useLocale();

	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();
	const searchParams = useSearchParams();

	const isMobile = useIsMobile();

	function onSelectChange(val: Locale) {
		startTransition(() => {
			router.replace(
				{
					pathname,
					query: {
						...params,
						...Object.fromEntries(searchParams.entries()),
					},
				},
				{ locale: val },
			);
		});
	}

	return (
		<Select value={locale} onValueChange={onSelectChange} disabled={isPending}>
			<SelectTrigger
				className={cn(
					isMobile ? "w-26" : "w-[150px]",
					isPending && "transition-opacity [&:disabled]:opacity-30",
					className,
				)}
				aria-label={t("label")}
			>
				<SelectValue placeholder={t("label")} />
			</SelectTrigger>
			<SelectContent>
				{routing.locales.map((cur) => (
					<SelectItem key={cur} value={cur}>
						<Globe className="size-4" />
						{t(isMobile ? "locale-short" : "locale", { locale: cur })}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
