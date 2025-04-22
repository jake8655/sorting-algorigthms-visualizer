import { useTranslations } from "next-intl";
import { HexagonBackground } from "@/components/animate-ui/hexagon-background";
import SortingVisualizer from "@/components/sorting-visualizer";

export default function Playground() {
  const t = useTranslations("home");

  return (
    <HexagonBackground className="absolute inset-0 flex min-h-screen flex-col items-center justify-between p-8">
      <div className="pointer-events-none z-10 w-full max-w-5xl">
        <h1 className="pointer-events-auto mb-28 text-center font-bold text-5xl">
          {t("title")}
        </h1>
        <p>{t("about")}</p>
        <SortingVisualizer />
      </div>
    </HexagonBackground>
  );
}
