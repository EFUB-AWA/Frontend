// 피그마 분석 요약. 경고 #ff4747, 주의 #f59e0b, 안정 #00bf63, 파란 숫자는 brand
export type SummaryTone = "danger" | "caution" | "stable" | "brand";

type SummaryCardProps = {
  label: string;
  value: string;
  score?: string;
  tone?: SummaryTone;
};

const toneClass: Record<SummaryTone, string> = {
  danger: "summary-card-danger",
  caution: "summary-card-caution",
  stable: "summary-card-stable",
  brand: "summary-card-brand",
};

export function SummaryCard({ label, value, score, tone = "brand" }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <p className="summary-card-label">{label}</p>
      <p className={`summary-card-value ${toneClass[tone]}`}>
        {value}
        {score ? <span className="summary-card-suffix">{score}</span> : null}
      </p>
    </article>
  );
}
