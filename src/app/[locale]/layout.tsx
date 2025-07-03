import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, type Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "./globals.css";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import Providers from "@/components/providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
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
	if (!hasLocale(routing.locales, locale)) notFound();

	// Enable static rendering
	setRequestLocale(locale);

	return (
		<html lang={locale}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} dark font-sans antialiased`}
			>
				<Providers>
					<NextIntlClientProvider>
						<Navigation />
						{children}
						<Footer />
					</NextIntlClientProvider>
				</Providers>
			</body>
		</html>
	);
}
