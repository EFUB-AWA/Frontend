"use client";

import { useEffect ,useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisPanel } from "@/components/analysis/analysis-panel";
import { AnalysisTitle } from "@/components/analysis/analysis-title";
import { Breadcrumb } from "@/components/analysis/breadcrumb";
import { PercentInput } from "@/components/analysis/percent-input";
import { SaveNotice } from "@/components/analysis/save-notice";
import { SelectButton } from "@/components/analysis/select-button";
import { SummaryCard } from "@/components/analysis/summary-card";
import type { SummaryTone } from "@/components/analysis/summary-card";
import { TabGroup } from "@/components/analysis/tab-group";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";

const tabs = [
  { id: "summary", label: "종합 분석" },
  { id: "stress", label: "스트레스 테스트" },
  { id: "consulting", label: "AI 컨설팅" },
];

const fundScale = [0, 20, 40, 60, 80, 100];

const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

// 피그마 세로선 위치.
const monthX = [109, 200, 283, 366, 456, 539, 629, 711, 802, 884, 981, 1063];

const monthTicks = [
  { label: "100", y: 27 },
  { label: "75", y: 53 },
  { label: "50", y: 78 },
  { label: "25", y: 104 },
  { label: "0", y: 129 },
];

const chartWidth = 1200;
const plotTop = 27;
const plotHeight = 102;

type SummaryItem = {
  label: string;
  value: string;
  score?: string;
  tone: SummaryTone;
};

type FundRow = {
  label: string;
  value: number;
};

type MonthSeries = {
  label: string;
  color: string;
  marker: string;
  values: number[];
};

// 피그마 종합 분석 프레임의 문구와 눈금 값
const summaryFrame = {
  name: "연남동 후보 1번 매물",
  area: "서울 마포구 연남동",
  category: "카페",
  chartName: "연남동 후보 1번",
  cards: [
    { label: "계약 안정성", value: "주의", score: "68점", tone: "caution" },
    { label: "예상 월 수익", value: "+320만원", tone: "brand" },
    { label: "생존 가능 기간", value: "약 8개월", tone: "brand" },
    { label: "손익분기 매출", value: "1,600만원", tone: "brand" },
  ] satisfies SummaryItem[],
  funds: [
    { label: "보유자금", value: 100 },
    { label: "초기비용", value: 51.6 },
    { label: "잔여운영자금", value: 42.4 },
    { label: "예상운영비", value: 45 },
    { label: "관리비", value: 12.5 },
    { label: "예상매출", value: 64.7 },
  ] satisfies FundRow[],
  monthlyRevenue: [52.9, 36.3, 52.9, 23, 76.5, 48.5, 60.3, 41.2, 55.4, 52, 60.3, 76.5],
  trade: [
    {
      label: "매출 추이",
      color: "#f772bd",
      marker: "/icon.svg/chart-marker-pink.svg",
      values: [63.7, 47.1, 63.7, 33.8, 87.3, 59.3, 71.1, 51, 66.2, 62.7, 71.1, 87.3],
    },
    {
      label: "개업률",
      color: "#00bf63",
      marker: "/icon.svg/chart-marker-green.svg",
      values: [48, 31.4, 48, 18.1, 71.6, 43.6, 55.4, 36.3, 50.5, 47.1, 55.4, 71.6],
    },
    {
      label: "폐업률",
      color: "#f59e0b",
      marker: "/icon.svg/chart-marker-amber.svg",
      values: [32.4, 15.7, 32.4, 2.5, 55.9, 27.9, 39.7, 20.6, 34.8, 31.4, 39.7, 55.9],
    },
  ] satisfies MonthSeries[],
  breakEven: {
    highlight: "월 1,930만원 이상",
    note: "이면 손실 없이 운영 가능해요.",
  },
};

// 피그마 스트레스 테스트 프레임의 -10% 화면
const stressFrame = {
  presets: ["-10%", "-20%", "-30%"],
  cards: [
    { label: "예상 매출", value: "1,600만원", tone: "brand" },
    { label: "월 손익", value: "-120만원", tone: "brand" },
    { label: "생존 가능 기간", value: "약 6개월 20일", tone: "brand" },
    { label: "자금 소진 예상 일자", value: "2027년 4월", tone: "brand" },
  ] satisfies SummaryItem[],
  series: [
    {
      label: "예상 매출",
      color: "#00bf63",
      marker: "/icon.svg/chart-marker-green.svg",
      values: [48, 31.4, 48, 18.1, 71.6, 43.6, 55.4, 36.3, 50.5, 47.1, 55.4, 71.6],
    },
    {
      label: "월 손익",
      color: "#f59e0b",
      marker: "/icon.svg/chart-marker-amber.svg",
      values: [32.4, 15.7, 32.4, 2.5, 55.9, 27.9, 39.7, 20.6, 34.8, 31.4, 39.7, 55.9],
    },
  ] satisfies MonthSeries[],
};

// 피그마 AI 컨설팅 프레임의 문구
const consultingFrame = {
  opinion: "현재 자금 기준 계약은 가능하지만 초기 투자금 비중이 높은 편이에요.",
  sections: [
    { title: "주요 위험 요인", items: ["인사이트", "인사이트", "인사이트"] },
    { title: "긍정 요인", items: ["인사이트", "인사이트", "인사이트"] },
    { title: "권장 계약 조건", items: ["인사이트", "인사이트", "인사이트"] },
  ],
};

function plotY(value: number) {
  return plotTop + plotHeight * (1 - value / 100);
}

function FundChart({ rows, legend }: { rows: FundRow[]; legend: string }) {
  return (
    <div className="analysis-chart">
      <div className="fund-axis">
        {fundScale.map((tick) => (
          <span key={tick} className="fund-tick" style={{ left: `${tick}%` }}>
            {tick}
          </span>
        ))}
      </div>
      <div className="fund-plot">
        {fundScale.map((tick) => (
          <span key={tick} className="fund-grid" style={{ left: `${tick}%` }} />
        ))}
        <div className="fund-rows">
          {rows.map((row) => (
            <div key={row.label} className="fund-row">
              <span className="fund-label">{row.label}</span>
              <span className="fund-bar" style={{ width: `${row.value}%` }} />
              <span className="fund-value" style={{ left: `calc(${row.value}% + 6px)` }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-key">
        <span className="fund-swatch" />
        {legend}
      </div>
    </div>
  );
}

function MonthChart({ series, tall = false }: { series: MonthSeries[]; tall?: boolean }) {
  const chartClass = tall ? "analysis-chart analysis-chart-tall" : "analysis-chart";

  return (
    <div className={chartClass}>
      {monthTicks.map((tick) => (
        <span key={tick.label} className="month-grid-x" style={{ top: tick.y }} />
      ))}
      {monthX.map((x) => (
        <span key={x} className="month-grid-y" style={{ left: `${(x / chartWidth) * 100}%` }} />
      ))}
      {monthTicks.map((tick) => (
        <span key={tick.label} className="month-ylabel" style={{ top: tick.y }}>
          {tick.label}
        </span>
      ))}
      {months.map((month, index) => (
        <span key={month} className="month-xlabel" style={{ left: `${(monthX[index] / chartWidth) * 100}%` }}>
          {month}
        </span>
      ))}
      <svg className="month-chart-line" viewBox={`0 0 ${chartWidth} 171`} preserveAspectRatio="none" aria-hidden="true">
        {series.map((item) => (
          <polyline
            key={item.label}
            points={item.values.map((value, index) => `${monthX[index]},${plotY(value)}`).join(" ")}
            fill="none"
            stroke={item.color}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {series.map((item) =>
        item.values.map((value, index) => (
          <span
            key={`${item.label}-${months[index]}`}
            className="month-chart-dot"
            style={{
              left: `${(monthX[index] / chartWidth) * 100}%`,
              top: plotY(value),
              borderColor: item.color,
            }}
          />
        )),
      )}
      {tall ? (
        <div className="month-chart-pills">
          {series.map((item) => (
            <span key={item.label} className="month-chart-pill">
              <img src={item.marker} width={18} height={10} alt="" />
              {item.label}
            </span>
          ))}
        </div>
      ) : (
        <div className="chart-key chart-key-lower">
          <img src={series[0].marker} width={18} height={10} alt="" />
          {series[0].label}
        </div>
      )}
    </div>
  );
}

function ResultActions({
  saved,
  near,
  onSave,
  onLeave,
}: {
  saved: boolean;
  near: boolean;
  onSave: () => void;
  onLeave: () => void;
}) {
  const placement = near ? "analysis-actions analysis-actions-near" : "analysis-actions";

  return (
    <div className={placement}>
      {saved ? (
        <div className="analysis-save-slot">
          <SaveNotice message="저장이 완료되었어요." />
        </div>
      ) : null}
      <Button variant="gray" onClick={onLeave}>
        다른 매물 분석하기
      </Button>
      <Button onClick={onSave}>저장하기</Button>
    </div>
  );
}

export default function AnalysisResultPage() {
  const router = useRouter();
  const [tab, setTab] = useState("summary");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
  if (!saved) {
    return;
  }

  const timer = window.setTimeout(() => setSaved(false), 2000);
  return () => window.clearTimeout(timer);
}, [saved]);

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [preset, setPreset] = useState("-10%");
  const [customRate, setCustomRate] = useState("");
  const monthlySeries = [
    {
      label: summaryFrame.chartName,
      color: "#186ded",
      marker: "/icon.svg/chart-marker-blue.svg",
      values: summaryFrame.monthlyRevenue,
    },
  ] satisfies MonthSeries[];

  return (
    <div className="analysis-result">
      <div className="analysis-result-head">
        <Breadcrumb label="뒤로 가기" onClick={() => router.back()} />
        <AnalysisTitle
          name={summaryFrame.name}
          area={summaryFrame.area}
          category={summaryFrame.category}
        />
        <TabGroup items={tabs} selectedId={tab} onSelect={setTab} />
      </div>
      {tab === "summary" ? (
        <>
          <div className="summary-row">
            {summaryFrame.cards.map((card) => (
              <SummaryCard
                key={card.label}
                label={card.label}
                value={card.value}
                score={card.score}
                tone={card.tone}
              />
            ))}
          </div>
          <section className="analysis-block">
            <h2 className="analysis-block-title">자금 구성</h2>
            <FundChart rows={summaryFrame.funds} legend={summaryFrame.chartName} />
          </section>
          <section className="analysis-block">
            <h2 className="analysis-block-title">예상 월 수익</h2>
            <MonthChart series={monthlySeries} />
          </section>
          <section className="analysis-block">
            <h2 className="analysis-block-title">상권 분석</h2>
            <MonthChart series={summaryFrame.trade} tall />
          </section>
          <section className="analysis-block">
            <h2 className="analysis-block-title">손익분기점</h2>
            <AnalysisPanel layout="row">
              <span className="analysis-panel-strong">{summaryFrame.breakEven.highlight}</span>
              <span className="analysis-panel-note">{summaryFrame.breakEven.note}</span>
            </AnalysisPanel>
          </section>
          <ResultActions saved={saved} near={false} onSave={() => setSaved(true)} onLeave={() => setLeaveOpen(true)} />
        </>
      ) : null}
      {tab === "stress" ? (
        <>
          <div className="stress-controls">
            {stressFrame.presets.map((label) => (
              <SelectButton
                key={label}
                className="select-button-compact"
                selected={preset === label}
                onClick={() => {
                  setPreset(label);
                  setCustomRate("");
                }}
              >
                {label}
              </SelectButton>
            ))}
            <PercentInput
              value={customRate}
              onChange={(value) => {
                setCustomRate(value);
                setPreset(value === "" ? "-10%" : "");
              }}
            />
          </div>
          <div className="summary-row">
            {stressFrame.cards.map((card) => (
              <SummaryCard key={card.label} label={card.label} value={card.value} tone={card.tone} />
            ))}
          </div>
          <section className="analysis-block">
            <h2 className="analysis-block-title">운영 자금 변화</h2>
            <MonthChart series={stressFrame.series} tall />
          </section>
          <section className="analysis-block">
            <h2 className="analysis-block-title">시나리오 비교</h2>
            <AnalysisPanel>
              <span className="analysis-panel-slot" />
            </AnalysisPanel>
          </section>
          <ResultActions saved={saved} near onSave={() => setSaved(true)} onLeave={() => setLeaveOpen(true)} />
        </>
      ) : null}
      {tab === "consulting" ? (
        <>
          <section className="analysis-block">
            <h2 className="analysis-block-title">종합 의견</h2>
            <AnalysisPanel variant="fill">
              <span className="analysis-panel-note">{consultingFrame.opinion}</span>
            </AnalysisPanel>
          </section>
          {consultingFrame.sections.map((section) => (
            <section key={section.title} className="analysis-block">
              <h2 className="analysis-block-title">{section.title}</h2>
              <AnalysisPanel layout="list">
                {section.items.map((item, index) => (
                  <p key={`${section.title}-${index}`} className="insight-row">
                    <img src="/icon.svg/check.svg" width={20} height={20} alt="" />
                    {item}
                  </p>
                ))}
              </AnalysisPanel>
            </section>
          ))}
          <ResultActions saved={saved} near={false} onSave={() => setSaved(true)} onLeave={() => setLeaveOpen(true)} />
        </>
      ) : null}
      <ConfirmModal
        open={leaveOpen}
        title="다른 매물을 분석할까요?"
        description={"현재 분석 결과를 저장하지 않으면\n나중에 다시 확인할 수 없어요."}
        cancelLabel="취소"
        confirmLabel="나가기"
        onCancel={() => setLeaveOpen(false)}
        onConfirm={() => router.push("/listings/new")}
      />
    </div>
  );
}
