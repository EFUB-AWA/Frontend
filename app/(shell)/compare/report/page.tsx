"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnalysisPanel } from "@/components/analysis/analysis-panel";
import { CompareHeading } from "@/components/compare/compare-heading";
import { readCompareNames, recommendedName } from "@/components/compare/compare-names";
import { CompareSavedModal } from "@/components/compare/compare-saved-modal";
import { Button } from "@/components/ui/button";

const opinion = "현재 자금 기준 계약은 가능하지만 초기 투자금 비중이 높은 편이에요.";

const sections = [
  { title: "주요 위험 요인", items: ["인사이트", "인사이트", "인사이트"] },
  { title: "긍정 요인", items: ["인사이트", "인사이트", "인사이트"] },
  { title: "권장 계약 조건", items: ["인사이트", "인사이트", "인사이트"] },
];

function CompareReportScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const names = readCompareNames(params);
  const recommended = recommendedName(names);
  const [savedOpen, setSavedOpen] = useState(false);
  const query = params.toString();

  return (
    <section className="analysis-result">
      <CompareHeading
        backLabel="이전으로"
        onBack={() => router.push(query ? `/compare/result?${query}` : "/compare/result")}
        names={names}
        recommended={recommended}
      />
      <section className="analysis-block">
        <h2 className="analysis-block-title">AI 분석 종합 의견</h2>
        <AnalysisPanel variant="fill">
          <span className="analysis-panel-note">{opinion}</span>
        </AnalysisPanel>
      </section>
      {sections.map((section) => (
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
      <div className="analysis-actions">
        <Button variant="gray" onClick={() => router.push(query ? `/compare/result?${query}` : "/compare/result")}>
          이전
        </Button>
        <Button onClick={() => setSavedOpen(true)}>분석 결과 저장하기</Button>
      </div>
      <CompareSavedModal open={savedOpen} onClose={() => setSavedOpen(false)} />
    </section>
  );
}

export default function CompareReportPage() {
  return (
    <Suspense fallback={null}>
      <CompareReportScreen />
    </Suspense>
  );
}