import { SiBluesky, SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { GitHubStarsButton } from "./animate-ui/github-stars-button";

export default function Footer() {
	const t = useTranslations("footer");

	return (
		<footer className="bg-[oklch(0.208_0.042_265.755)] px-4 py-12 md:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col items-center justify-between md:flex-row">
					<div className="mb-6 md:mb-0">
						<h3 className="font-bold text-[oklch(0.984_0.003_247.858)] text-xl">
							{t("title")}
						</h3>
						<p className="mt-2 text-[oklch(0.984_0.003_247.858)/70]">
							{t("description")}
						</p>
					</div>

					<div className="flex space-x-4">
						<FooterEntry href="mailto:info@dominiktoth.com">
							<Mail className="text-white" />
						</FooterEntry>
						<FooterEntry href="https://github.com/jake8655">
							<SiGithub className="text-white" />
						</FooterEntry>
						<FooterEntry href="https://discord.com/users/300963276223807488">
							<SiDiscord className="text-discord-blue" />
						</FooterEntry>
						<FooterEntry href="https://bsky.app/profile/dominiktoth.com">
							<SiBluesky className="text-bluesky-blue" />
						</FooterEntry>
					</div>
				</div>

				<div className="mt-8 flex flex-col items-center justify-between gap-4 border-[oklch(0.984_0.003_247.858)/10] border-t pt-8 md:flex-row md:gap-0">
					<div className="flex flex-col items-center md:items-start">
						<p className="text-foreground/70 text-sm">
							© {new Date().getFullYear()}{" "}
							<a
								href="https://dominiktoth.com"
								target="_blank"
								rel="noreferrer noopener"
							>
								Dominik Tóth
							</a>
						</p>
						<p className="text-foreground/70 text-sm">{t("copyright")}</p>
					</div>

					<GitHubStarsButton
						username="jake8655"
						repo="sorting-algorithms-visualizer"
						className="bg-foreground text-background"
					/>
				</div>
			</div>
		</footer>
	);
}

function FooterEntry({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="flex gap-2 text-sm transition-transform hover:scale-110 md:text-base"
		>
			{children}
		</a>
	);
}
