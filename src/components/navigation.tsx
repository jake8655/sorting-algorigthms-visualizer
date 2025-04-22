import { useTranslations } from "next-intl";
import LocaleSwitcher from "./locale-switcher";
import { Link } from "@/i18n/navigation";

export default function Navigation() {
  const t = useTranslations("navigation");

  return (
    <div className="bg-slate-850">
      <nav className="container flex justify-between p-2 text-white">
        <div>
          <Link href="/">{t("home")}</Link>
          <Link href="/playground">{t("playground")}</Link>
        </div>
        <LocaleSwitcher />
      </nav>
    </div>
  );
}
