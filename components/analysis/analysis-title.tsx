// 피그마 TitleSection. 파란 글자는 매물 이름
type AnalysisTitleProps = {
  name: string;
  area: string;
  category: string;
  suffix?: string;
};

export function AnalysisTitle({
  name,
  area,
  category,
  suffix = "을 분석했어요.",
}: AnalysisTitleProps) {
  return (
    <header className="analysis-title">
      <h1 className="analysis-title-heading">
        <span className="analysis-title-name">{name}</span>
        {suffix}
      </h1>
      <p className="analysis-title-sub">
        <span>{area}</span>
        <img src="/icon.svg/divider.svg" width={3} height={3} alt="" />
        <span>{category}</span>
      </p>
    </header>
  );
}
