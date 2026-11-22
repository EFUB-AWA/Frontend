"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnalysisPanel } from "@/components/analysis/analysis-panel";
import { CompareHeading } from "@/components/compare/compare-heading";
import { readCompareNames, recommendedName } from "@/components/compare/compare-names";
import { CompareSavedModal } from "@/components/compare/compare-saved-modal";
import { Button } from "@/components/ui/button";

const rows = ["안정성", "예상 매출", "초기 비용", "월 고정비", "예상순이익", "BEP", "생존기간"];

function CompareResultScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const names = readCompareNames(params);
  const recommended = recommendedName(names);
  const [savedOpen, setSavedOpen] = useState(false);
  const query = params.toString();

  return (
    <section className="analysis-result">
      <CompareHeading backLabel="목록으로" onBack={() => router.push("/compare")} names={names} recommended={recommended} />
      <section className="analysis-block">
        <h2 className="analysis-block-title">요약 인사이트</h2>
        <AnalysisPanel variant="fill">
          <div className="compare-summary">
            <p className="compare-summary-lead">
              현재 자금 상황에서는 <span className="analysis-title-name">{recommended}</span>이 상대적으로 안정적입니다.
            </p>
            <p className="compare-summary-note">초기 투자 비용이 낮고 매출 -20% 상황에서도 더 오래 버틸 수 있어요.</p>
          </div>
        </AnalysisPanel>
      </section>
      <section className="analysis-block">
        <h2 className="analysis-block-title">비교 테이블</h2>
        <div className="compare-table">
          <table>
            <thead>
              <tr>
                <th scope="col">항목</th>
                {names.map((name, index) => (
                  <th key={`${name}-${index}`} scope="col">
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  {names.map((name, index) => (
                    <td key={`${row}-${name}-${index}`}>값</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="analysis-actions">
        <Button variant="gray" onClick={() => router.push(query ? `/compare/report?${query}` : "/compare/report")}>
          AI 리포트 확인하기
        </Button>
        <Button onClick={() => setSavedOpen(true)}>분석 결과 저장하기</Button>
      </div>
      <CompareSavedModal open={savedOpen} onClose={() => setSavedOpen(false)} />
    </section>
  );
}

export default function CompareResultPage() {
  return (
    <Suspense fallback={null}>
      <CompareResultScreen />
    </Suspense>
  );
}