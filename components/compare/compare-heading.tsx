import { Fragment } from "react";
import { Breadcrumb } from "@/components/analysis/breadcrumb";

type CompareHeadingProps = {
  backLabel: string;
  onBack: () => void;
  names: string[];
  recommended: string;
};

export function CompareHeading({ backLabel, onBack, names, recommended }: CompareHeadingProps) {
  return (
    <header className="analysis-result-head">
      <Breadcrumb label={backLabel} onClick={onBack} />
      <div className="analysis-title">
        <p className="analysis-title-sub">
          {names.map((name, index) => (
            <Fragment key={`${name}-${index}`}>
              {index > 0 ? <img src="/icon.svg/divider.svg" width={3} height={3} alt="" /> : null}
              <span>{name}</span>
            </Fragment>
          ))}
          <span>중에서는</span>
        </p>
        <h1 className="analysis-title-heading">
          <span className="analysis-title-name">{recommended}</span>
          을 추천해요
        </h1>
      </div>
    </header>
  );
}