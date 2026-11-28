"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnalysisPanel } from "@/components/analysis/analysis-panel";
import { AnalysisTitle } from "@/components/analysis/analysis-title";
import { Breadcrumb } from "@/components/analysis/breadcrumb";
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

const stressPresets = ["0%", "10%", "20%", "30%"];

// GET /api/consultations/properties/{propertyConsultId}
const consultingSections = ["주요 위험 요인", "긍정 요인", "권장 계약 조건"];

type SummaryItem = {
  label: string;
  value: string;
  score?: string;
  tone: SummaryTone;
};

type FundRow = {
  label: string;
  amount: string;
};

type MonthSeries = {
  label: string;
  color: string;
  marker: string;
  values: number[];
};

type PropertyAnalysis = {
  propertyName: string;
  address: string;
  industryName: string;
  summary: {
    safetyScore: number;
    safetyGrade: string;
    monthlyOperatingProfit: number;
    survivalMonths: number | null;
    breakEvenSales: number;
  };
  capitalBreakdown: {
    totalCapital: number;
    initialRequiredCash: number;
    initialOperatingCash: number;
    monthlyTotalOperatingCost: number | null;
    monthlyManagementFee: number;
    expectedMonthlySales: number;
  };
  monthlyProfitForecast: {
    month: string;
    operatingProfitWon: number;
  }[];
  commercialTrend: {
    points: {
      quarterCode: string;
      reportedSalesAmountWon: number;
      openingRatePercent: number;
      closureRatePercent: number | null;
    }[];
  } | null;
};

function manWon(won: number) {
  return `${(won / 10000).toLocaleString("ko-KR")}만 원`;
}

function signedManWon(won: number) {
  if (won > 0) return `+${manWon(won)}`;
  return manWon(won);
}

// safetyGrade는 주의, 경고, 안정.
function safetyGradeLabel(grade: string) {
  if (grade === "A" || grade === "안정") return "안정";
  if (grade === "B" || grade === "주의") return "주의";
  if (grade === "C" || grade === "경고") return "경고";
  return grade;
}

function safetyTone(grade: string): SummaryTone {
  const label = safetyGradeLabel(grade);
  if (label === "경고") return "danger";
  if (label === "주의") return "caution";
  if (label === "안정") return "stable";
  return "brand";
}

function fundRows(capital: PropertyAnalysis["capitalBreakdown"]): FundRow[] {
  return [
    { label: "보유자금", amount: manWon(capital.totalCapital) },
    { label: "초기비용", amount: manWon(capital.initialRequiredCash) },
    { label: "잔여운영자금", amount: manWon(capital.initialOperatingCash) },
    {
      label: "예상운영비",
      amount: capital.monthlyTotalOperatingCost == null ? "" : manWon(capital.monthlyTotalOperatingCost),
    },
    { label: "관리비", amount: manWon(capital.monthlyManagementFee) },
    { label: "예상매출", amount: manWon(capital.expectedMonthlySales) },
  ];
}

const emptyFunds: FundRow[] = [
  { label: "보유자금", amount: "" },
  { label: "초기비용", amount: "" },
  { label: "잔여운영자금", amount: "" },
  { label: "예상운영비", amount: "" },
  { label: "관리비", amount: "" },
  { label: "예상매출", amount: "" },
];

// 로그인 전 accessToken은 null. 값이 생기면 Bearer
// 주소의 [id]를 propertyAnalysisId로. (확인 다시 해야함)
async function getPropertyAnalysis(propertyAnalysisId: number, accessToken: string) {
  const response = await fetch(`/api/property-analyses/${propertyAnalysisId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // 401 INVALID_ACCESS_TOKEN, 404 PROPERTY_ANALYSIS_NOT_FOUND,
  // 409 ANALYSIS_NOT_COMPLETED, 500 INTERNAL_SERVER_ERROR.
  // path는 /financial, 호출 주소는 /api/property-analyses/{propertyAnalysisId}
  if (response.status !== 200) return null;

  const analysis = (await response.json()) as PropertyAnalysis;
  return analysis;
}

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
              {/* 막대 길이 그려야함. 눈금은 0~100, 원 금액을 나눌 기준 세워야함*/}
              <span className="fund-bar" />
              <span className="fund-value" style={{ left: 0 }}>
                {row.amount}
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
  const keyed = series[0];

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
      ) : keyed ? (
        <div className="chart-key chart-key-lower">
          <img src={keyed.marker} width={18} height={10} alt="" />
          {keyed.label}
        </div>
      ) : null}
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

export function AnalysisResultScreen() {
  const router = useRouter();
  const params = useParams();
  const propertyAnalysisId = Number(params.id);
  const [tab, setTab] = useState("summary");
  const [saved, setSaved] = useState(false);
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [preset, setPreset] = useState("0%");

  useEffect(() => {
    if (!saved) return;

    const timer = window.setTimeout(() => setSaved(false), 2000);
    return () => window.clearTimeout(timer);
  }, [saved]);

  useEffect(() => {
    const accessToken: string | null = null;
    if (accessToken === null || !Number.isInteger(propertyAnalysisId)) return;

    let ignore = false;

    getPropertyAnalysis(propertyAnalysisId, accessToken).then((result) => {
      if (!ignore && result) setAnalysis(result);
    });

    return () => {
      ignore = true;
    };
  }, [propertyAnalysisId]);

  const summary = analysis?.summary;
  const breakEven = summary ? manWon(summary.breakEvenSales) : "";
  const cards: SummaryItem[] = [
    {
      label: "계약 안정성",
      value: summary ? safetyGradeLabel(summary.safetyGrade) : "",
      score: summary ? `${summary.safetyScore}점` : undefined,
      tone: summary ? safetyTone(summary.safetyGrade) : "caution",
    },
    {
      label: "예상 월 수익",
      value: summary ? signedManWon(summary.monthlyOperatingProfit) : "",
      tone: "brand",
    },
    {
      // 생존 가능 기간은 추가 보완 예정.
      label: "생존 가능 기간",
      value: "",
      tone: "brand",
    },
    {
      label: "손익분기 매출",
      value: breakEven,
      tone: "brand",
    },
  ];

  // 매물별 분석 저장 API가 없는 거 같음
  // 저장하기는 서버에 보내는 게 아니고 저장 안내만 잠깐 보여 주는거
  function markSaved() {
    setSaved(true);
  }

  return (
    <div className="analysis-result">
      <div className="analysis-result-head">
        <Breadcrumb label="뒤로 가기" onClick={() => router.back()} />
        <AnalysisTitle
          name={analysis?.propertyName ?? ""}
          area={analysis?.address ?? ""}
          category={analysis?.industryName ?? ""}
        />
        <TabGroup items={tabs} selectedId={tab} onSelect={setTab} />
      </div>
      {tab === "summary" ? (
        <>
          <div className="summary-row">
            {cards.map((card) => (
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
            {/* capitalBreakdown은 원. 화면에는 만 원으로 보이게. monthlyTotalOperatingCost는 없으면 null. */}
            <FundChart rows={analysis ? fundRows(analysis.capitalBreakdown) : emptyFunds} legend={analysis?.propertyName ?? ""} />
          </section>
          <section className="analysis-block">
            <h2 className="analysis-block-title">예상 월 수익</h2>
            {/*
              그래프는 연결 아직 안했음
              monthlyProfitForecast는 month(YYYY-MM), operatingProfitWon(원).
              매물별 월별 예상 수익은 추가 보완 예정이다.
              화면 축은 1월~12월이라 배열을 그대로 올리지 않고 없으면 [].
            */}
          </section>
          <section className="analysis-block">
            <h2 className="analysis-block-title">상권 분석</h2>
            {/*
              그래프는 연결하지 않는다.
              commercialTrend.points는 분기. quarterCode 20262는 2026년 2분기.
              reportedSalesAmountWon은 원, openingRatePercent와 closureRatePercent는 퍼센트.
              기록이 없으면 commercialTrend는 null이고, 지표가 없으면 그 값만 null.
              화면은 월 12칸.
            */}
          </section>
          <section className="analysis-block">
            <h2 className="analysis-block-title">손익분기점</h2>
            <AnalysisPanel layout="row">
              {breakEven ? (
                <>
                  <span className="analysis-panel-strong">{`월 ${breakEven} 이상`}</span>
                  <span className="analysis-panel-note">이면 손실 없이 운영 가능해요</span>
                </>
              ) : null}
            </AnalysisPanel>
          </section>
          <ResultActions saved={saved} near={false} onSave={markSaved} onLeave={() => setLeaveOpen(true)} />
        </>
      ) : null}
      {tab === "stress" ? (
        <>
          {/*
            스트레스 테스트 자리
            목록 GET /api/property-analyses/{propertyAnalysisId}/stress-tests
            상세 GET /api/property-analyses/{propertyAnalysisId}/stress-tests/{stressTestId}
            월별 현금흐름 GET /api/stress-tests/{stressTestId}/cash-flows
            상세에 있는 필드는 감소율, 소진 여부, 소진 개월 차, 안정성 점수, 안정성 등급뿐.
            카드의 예상 매출, 월 손익 필드는 없다. 생존 가능 기간은 추가 보완 예정.
            미소진 문구는 무슨 말인지 모르겠음.
            월별 현금흐름이 운영 자금 변화 그래프인지도, sales와 netCashFlow 중 어느 선인지도 없음.
            monthIndex는 개월 차이고 화면 축은 1월~12월. 공지상 기간은 12개월.
            시나리오 비교 UI는 아직 없음.
            직접 입력은 제외, 감소율은 0, 10, 20, 30.
            운영 자금 변화 선 색만 피그마에 있음. 예상 매출 #00bf63, 월 손익 #f59e0b.
          */}
          <div className="stress-controls">
            {stressPresets.map((label) => (
              <SelectButton
                key={label}
                className="select-button-compact"
                selected={preset === label}
                onClick={() => setPreset(label)}
              >
                {label}
              </SelectButton>
            ))}
          </div>
          <div className="summary-row">
            {["예상 매출", "월 손익", "생존 가능 기간", "자금 소진 예상 일자"].map((label) => (
              <SummaryCard key={label} label={label} value="" tone="brand" />
            ))}
          </div>
          <section className="analysis-block">
            <h2 className="analysis-block-title">운영 자금 변화</h2>
          </section>
          <section className="analysis-block">
            <h2 className="analysis-block-title">시나리오 비교</h2>
            <AnalysisPanel>
              <span className="analysis-panel-slot" />
            </AnalysisPanel>
          </section>
          <ResultActions saved={saved} near onSave={markSaved} onLeave={() => setLeaveOpen(true)} />
        </>
      ) : null}
      {tab === "consulting" ? (
        <>
          {/* 후보 매물 AI 컨설팅 응답 필드를 받아야한다*/}
          <section className="analysis-block">
            <h2 className="analysis-block-title">종합 의견</h2>
            <AnalysisPanel variant="fill">{null}</AnalysisPanel>
          </section>
          {consultingSections.map((title) => (
            <section key={title} className="analysis-block">
              <h2 className="analysis-block-title">{title}</h2>
              <AnalysisPanel layout="list">{null}</AnalysisPanel>
            </section>
          ))}
          <ResultActions saved={saved} near={false} onSave={markSaved} onLeave={() => setLeaveOpen(true)} />
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
