import { Suspense } from "react";
import { AnalysisResultScreen } from "./result-screen";

export default function AnalysisResultPage() {
  return (
    <Suspense fallback={null}>
      <AnalysisResultScreen />
    </Suspense>
  );
}
