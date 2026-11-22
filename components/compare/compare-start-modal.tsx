"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

export type CompareChip = {
  id: string;
  name: string;
  included: boolean;
};

type CompareStartModalProps = {
  open: boolean;
  chips: CompareChip[];
  name: string;
  onNameChange: (name: string) => void;
  onToggleChip: (id: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function CompareStartModal({
  open,
  chips,
  name,
  onNameChange,
  onToggleChip,
  onCancel,
  onConfirm,
}: CompareStartModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
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
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-modal-layer">
      <div className="confirm-modal compare-start-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId} className="confirm-modal-title">
          비교 분석을 진행할까요?
        </h2>
        <div className="compare-start-chips">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={chip.included ? "compare-chip compare-chip-selected" : "compare-chip"}
              aria-pressed={chip.included}
              onClick={() => onToggleChip(chip.id)}
            >
              {chip.name}
            </button>
          ))}
        </div>
        <label className="compare-start-field">
          <span className="field-label">비교 분석 이름을 입력해주세요.</span>
          <input
            className="field-input"
            value={name}
            placeholder="마포구 연남동 자리 비교"
            onChange={(event) => onNameChange(event.target.value)}
          />
          <p className="compare-start-help">분석 내용을 구별할 수 있도록 구체적으로 작성해주세요.</p>
        </label>
        <div className="confirm-modal-actions">
          <Button variant="gray" onClick={onCancel}>
            취소
          </Button>
          <Button onClick={onConfirm}>비교 분석 시작하기</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}