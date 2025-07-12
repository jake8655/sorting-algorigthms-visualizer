import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { type Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const dynamicParams = false;
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	return (
		<html lang={locale}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} dark font-sans antialiased`}
			>
				<NuqsAdapter>
					<NextIntlClientProvider>
						<Navigation />
						{children}
						<Footer />
					</NextIntlClientProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
