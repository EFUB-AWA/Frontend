import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UiPreviewPage() {
  return (
    <div className="ui-preview">
      <h1 className="page-title">공통 컴포넌트</h1>
      <Button>검정 버튼</Button>
      <Button variant="gray">회색 버튼</Button>
      <Input label="라벨" placeholder="입력해주세요" />
    </div>
  );
}
