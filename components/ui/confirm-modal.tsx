"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

// 피그마 Modal. "다른 매물 분석하기"
type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const titleId = useId();

  useEffect(() => {
  if (!open) {
    return;
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onCancel();
    }
  };

  const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
  const previousOverflow = document.body.style.overflow;
  const previousPaddingRight = document.body.style.paddingRight;

  document.body.style.overflow = "hidden";
  if (scrollbarGap > 0) {
    document.body.style.paddingRight = `${scrollbarGap}px`;
  }
  document.addEventListener("keydown", onKeyDown);

  return () => {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
    document.removeEventListener("keydown", onKeyDown);
  };
}, [open, onCancel]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="confirm-modal-layer">
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="confirm-modal-title">
          {title}
        </h2>
        <p className="confirm-modal-body">{description}</p>
        <div className="confirm-modal-actions">
          <Button variant="gray" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
