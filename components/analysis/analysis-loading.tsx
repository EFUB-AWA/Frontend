"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DOT_MS = 500;
const STEP_MS = 900;
const FINISH_PAUSE_MS = 500;

export type AnalysisLoadingProps = {
  title: string;
  cardTitle: string;
  steps: readonly string[];
  nextHref?: string;
  whenReady?: Promise<unknown>;
};

export function AnalysisLoading({ title, cardTitle, steps, nextHref, whenReady }: AnalysisLoadingProps) {
  const router = useRouter();
  const [activeDot, setActiveDot] = useState(1);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setActiveDot((current) => (current + 1) % 3);
    }, DOT_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    let completedCount = 0;
    let settled = false;
    let finished = false;
    let finishTimer = 0;
    const total = steps.length;
    const ready = whenReady ?? wait(Math.max(total, 1) * STEP_MS);

    setCompleted(0);

    ready.then(
      () => {
        settled = true;
      },
      () => {
        settled = false;
      },
    );

    const timer = window.setInterval(() => {
      if (!active) return;

      const limit = settled ? total : Math.max(total - 1, 0);
      if (completedCount < limit) {
        completedCount += 1;
        setCompleted(completedCount);
      }

      if (!finished && total > 0 && completedCount >= total) {
        finished = true;
        window.clearInterval(timer);
        finishTimer = window.setTimeout(() => {
          if (active && nextHref) router.push(nextHref);
        }, FINISH_PAUSE_MS);
      }
    }, STEP_MS);

    return () => {
      active = false;
      window.clearInterval(timer);
      window.clearTimeout(finishTimer);
    };
  }, [nextHref, router, steps, whenReady]);

  return (
    <section className="analysis-loading" aria-busy={completed < steps.length} aria-labelledby="analysis-loading-title">
      <div className="analysis-blobs" aria-hidden="true">
        <div className="analysis-blob analysis-blob-left">
          <img src="/Graphic.svg" alt="" />
        </div>
        <div className="analysis-blob analysis-blob-right">
          <img src="/Graphic2.svg" alt="" />
        </div>
      </div>
      <div className="analysis-loading-body">
        <h1 id="analysis-loading-title" className="analysis-loading-title">
          {title}
        </h1>
        <div className="analysis-dots" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span key={index} className={index === activeDot ? "analysis-dot is-active" : "analysis-dot"} />
          ))}
        </div>
        <section className="analysis-card" aria-label={cardTitle}>
          <h2 className="analysis-card-title">
            <img src="/icon.svg/lamp-on.svg" alt="" />
            {cardTitle}
          </h2>
          <hr className="analysis-card-divider" />
          <ul className="analysis-steps">
            {steps.map((step, index) => {
              const done = index < completed;
              return (
                <li key={step} className="analysis-step">
                  <span className="analysis-step-icon">
                    <img src={done ? "/icon.svg/tick-circle.svg" : "/icon.svg/check.svg"} alt={done ? "완료" : "대기"} />
                  </span>
                  {step}
                </li>
              );
            })}
          </ul>
        </section>
        <p className="analysis-live" aria-live="polite">
          {completed > 0 ? `${steps[completed - 1]} 완료` : "분석을 진행하고 있어요."}
        </p>
      </div>
    </section>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}