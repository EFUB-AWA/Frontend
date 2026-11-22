"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnalysisLoading } from "@/components/analysis/analysis-loading";

const listingSteps = ["상권 데이터 확인", "예상 매출 계산", "수익성 분석", "계약 안정성 분석"] as const;

const compareSteps = ["합정동 2층", "뚝섬역 5번 출구", "연남동 후보 1번"] as const;

function AnalysisLoadingScreen() {
  const params = useSearchParams();
  const isCompare = params.get("flow") === "compare";
  const name = params.get("name");

  if (isCompare) {
  const items = params.getAll("item");
  const next = new URLSearchParams();
  if (name) next.set("name", name);
  items.forEach((item) => next.append("item", item));

  return (
    <AnalysisLoading
      title="어떤 매물이 현재 상황에 더 적합한지 비교하고 있어요."
      cardTitle={name || "비교 분석 이름"}
      steps={items.length > 0 ? items : compareSteps}
      nextHref={`/compare/result?${next.toString()}`}
    />
  );
}



  return (
    <AnalysisLoading
      title="매물의 상권과 재무 상태를 분석하고 있어요."
      cardTitle="분석 진행 상황"
      steps={listingSteps}
      nextHref="/analysis/1"
    />
  );
}

export default function AnalysisLoadingPage() {
  return (
    <Suspense fallback={null}>
      <AnalysisLoadingScreen />
    </Suspense>
  );
}

/*http://localhost:3000/analysis/loading는 매물 분석 --> 끝나면 /analysis/1로 이동*/
/*http://localhost:3000/analysis/loading?flow=compare 는 비교 분석*/
/*http://localhost:3000/analysis/loading?flow=compare&name=비교이름 은 카드 제목만 비교이름으로 바뀜*/