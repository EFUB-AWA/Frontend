"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

type CompareSavedModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CompareSavedModal({ open, onClose }: CompareSavedModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarGap > 0) document.body.style.paddingRight = `${scrollbarGap}px`;
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-modal-layer">
      <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId} className="confirm-modal-title">
          비교 분석 결과를 저장했어요.
        </h2>
        <p className="confirm-modal-body">{"비교 분석 결과는\n분석 이력에서 확인할 수 있어요."}</p>
        <Button className="compare-saved-confirm" onClick={onClose}>
          확인
        </Button>
      </div>
    </div>,
    document.body,
  );
}