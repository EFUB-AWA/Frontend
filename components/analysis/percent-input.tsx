"use client";

// 피그마 Input 인스턴스. 스트레스 테스트의 "직접 입력"과 뒤의 단위
type PercentInputProps = {
  value?: string;
  placeholder?: string;
  suffix?: string;
  onChange?: (value: string) => void;
};

export function PercentInput({
  value,
  placeholder = "직접 입력",
  suffix = "%",
  onChange,
}: PercentInputProps) {
  return (
    <label className="percent-input">
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
      />
      <span className="percent-input-suffix">{suffix}</span>
    </label>
  );
}
