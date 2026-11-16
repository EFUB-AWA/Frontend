import type { ReactNode } from "react";

// 피그마 Content > Container
// fill: 회색 박스. line: 흰 테두리 박스
type AnalysisPanelProps = {
  variant?: "fill" | "line";
  layout?: "text" | "row" | "list";
  children: ReactNode;
};

export function AnalysisPanel({ variant = "line", layout = "text", children }: AnalysisPanelProps) {
  const surface = variant === "fill" ? "analysis-panel-fill" : "analysis-panel-line";
  const direction = layout === "list" ? "analysis-panel-list" : layout === "row" ? "analysis-panel-row" : "";

  return <div className={`analysis-panel ${surface} ${direction}`}>{children}</div>;
}
