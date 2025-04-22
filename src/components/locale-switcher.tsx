"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type Locale } from "next-intl";
import { useTransition } from "react";
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

  function onSelectChange(val: string) {
    const nextLocale = val as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <Select value={locale} onValueChange={onSelectChange} disabled={isPending}>
      <SelectTrigger
        className={cn(
          "w-[140px]",
          isPending && "transition-opacity [&:disabled]:opacity-30",
          className,
        )}
      >
        <SelectValue placeholder={t("label")} />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map(cur => (
          <SelectItem key={cur} value={cur}>
            {t("locale", { locale: cur })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
