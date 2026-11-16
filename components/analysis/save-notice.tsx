// 피그마 Toast. 이 화면 문구는 "저장이 완료되었어요."
type SaveNoticeProps = {
  message: string;
  variant?: "default" | "error";
};

export function SaveNotice({ message, variant = "default" }: SaveNoticeProps) {
  const color = variant === "error" ? "save-notice save-notice-error" : "save-notice";
  const icon = variant === "error" ? "/icon.svg/close-circle.svg" : "/icon.svg/tick-circle.svg";

  return (
    <div className={color} role="status">
      <img src={icon} width={24} height={24} alt="" />
      {message}
    </div>
  );
}
