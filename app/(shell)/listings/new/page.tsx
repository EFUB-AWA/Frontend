"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type ListingStep = "location" | "contract";

type ListingDraft = {
  name: string;
  address: string;
  addressDetail: string;
  area_m2: string;
  deposit: string;
  monthly_rent: string;
  key_money: string;
  monthly_maintenance_fee: string;
};

type MapPoint = {
  lat: number;
  lng: number;
};

type PostcodeResult = {
  roadAddress: string;
  jibunAddress: string;
};

const emptyDraft: ListingDraft = {
  name: "",
  address: "",
  addressDetail: "",
  area_m2: "",
  deposit: "",
  monthly_rent: "",
  key_money: "",
  monthly_maintenance_fee: "",
};

const contractFields = [
  { key: "deposit", label: "보증금" },
  { key: "monthly_rent", label: "월세" },
  { key: "key_money", label: "권리금" },
  { key: "monthly_maintenance_fee", label: "관리비" },
] as const;

function moneyAmount(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function inputMoneyLabel(value: string) {
  const amount = moneyAmount(value);
  if (amount === 0) return "0원";
  return `${amount.toLocaleString("ko-KR")}만원`;
}

const postcodeSrc = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: { oncomplete: (data: PostcodeResult) => void }) => { open: () => void };
    };
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => object;
        Map: new (container: HTMLElement, options: { center: object; level: number }) => object;
        Marker: new (options: { position: object }) => { setMap: (map: object) => void };
        services: {
          Geocoder: new () => {
            addressSearch: (address: string, callback: (result: { x: string; y: string }[], status: string) => void) => void;
          };
          Status: { OK: string };
        };
      };
    };
  }
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function loadScript(src: string) {
  const found = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

  if (found?.dataset.loaded === "true") return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    if (found) {
      found.addEventListener("load", () => resolve(), { once: true });
      found.addEventListener("error", () => reject(new Error(src)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(src));
    document.head.appendChild(script);
  });
}

async function searchAddressPoint(address: string) {
  const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  if (!key) return null;

  await loadScript(`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`);
  await new Promise<void>((resolve) => window.kakao?.maps.load(() => resolve()));

  const maps = window.kakao?.maps;
  if (!maps) return null;

  return new Promise<MapPoint | null>((resolve) => {
    const geocoder = new maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status !== maps.services.Status.OK || result.length === 0) {
        resolve(null);
        return;
      }
      resolve({ lat: Number(result[0].y), lng: Number(result[0].x) });
    });
  });
}

function KakaoMap({ point }: { point: MapPoint }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const maps = window.kakao?.maps;
    if (!container || !maps) return;

    const center = new maps.LatLng(point.lat, point.lng);
    const map = new maps.Map(container, { center, level: 3 });
    new maps.Marker({ position: center }).setMap(map);
  }, [point]);

  return <div className="listing-map" ref={containerRef} />;
}

function LocationFields({
  draft,
  mapPoint,
  onChange,
  onSearchAddress,
}: {
  draft: ListingDraft;
  mapPoint: MapPoint | null;
  onChange: (key: keyof ListingDraft, value: string) => void;
  onSearchAddress: () => void;
}) {
  return (
    <>
      <label className="field" htmlFor="listing-name">
        <span className="field-label">매물 이름</span>
        <input
          id="listing-name"
          className="field-input"
          placeholder="연남동 후보 1번"
          value={draft.name}
          onChange={(event) => onChange("name", event.target.value)}
        />
        <span className="field-help">매물을 구별할 수 있도록 구체적으로 작성해주세요.</span>
      </label>

      <div className="listing-address">
        <div className="field">
          <label className="field-label" htmlFor="listing-address">
            매물 주소
          </label>
          <span className="field-control">
            <input
              id="listing-address"
              className="field-input field-input-suffix"
              placeholder="주소를 검색해주세요."
              readOnly
              value={draft.address}
              onClick={onSearchAddress}
            />
            <button className="field-search" type="button" aria-label="주소 검색" onClick={onSearchAddress}>
              <img src="/icon.svg/search-line.svg" alt="" />
            </button>
          </span>
          <input
            id="listing-address-detail"
            className="field-input"
            placeholder="상세주소 입력 (동, 호수)"
            aria-label="상세주소"
            value={draft.addressDetail}
            onChange={(event) => onChange("addressDetail", event.target.value)}
          />
        </div>
        {mapPoint ? <KakaoMap point={mapPoint} /> : null}
      </div>

      <label className="field" htmlFor="listing-area">
        <span className="field-label">매장 면적</span>
        <span className="field-control">
          <input
            id="listing-area"
            className="field-input field-input-suffix"
            inputMode="numeric"
            placeholder="숫자만 입력"
            value={draft.area_m2}
            onChange={(event) => onChange("area_m2", digitsOnly(event.target.value))}
          />
          <span className="field-suffix">m²</span>
        </span>
      </label>
    </>
  );
}

function ContractFields({
  draft,
  onChange,
}: {
  draft: ListingDraft;
  onChange: (key: keyof ListingDraft, value: string) => void;
}) {
  const rows = contractFields.map((field) => ({
    ...field,
    amount: moneyAmount(draft[field.key]),
  }));
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <>
      {rows.map((field) => (
        <label className="field" htmlFor={`listing-${field.key}`} key={field.key}>
          <span className="field-label">{field.label}</span>
          <span className="field-control">
            <input
              id={`listing-${field.key}`}
              className="field-input field-input-suffix field-input-money"
              inputMode="numeric"
              placeholder="숫자만 입력"
              value={draft[field.key]}
              onChange={(event) => onChange(field.key, digitsOnly(event.target.value))}
            />
            <span className="field-suffix">{inputMoneyLabel(draft[field.key])}</span>
          </span>
        </label>
      ))}

      <section className="initial-fund" aria-label="예상 필요 초기 자금">
        <h2 className="initial-fund-heading">
          <img src="/icon.svg/calculator.svg" alt="" />
          예상 필요 초기 자금
          <span className="initial-fund-tag">자동계산</span>
        </h2>
        <hr className="initial-fund-divider" />
        <div className="initial-fund-price">
          <p className="initial-fund-total">
            약
            <span className="initial-fund-amount">
              <strong>{total.toLocaleString("ko-KR")}</strong>
              <span>만원</span>
            </span>
          </p>
          <p className="initial-fund-formula">
            {rows.map((row, index) => (
              <span key={row.key}>
                {index > 0 ? "+ " : ""}
                {row.label} {row.amount.toLocaleString("ko-KR")}만 원
              </span>
            ))}
          </p>
        </div>
      </section>
    </>
  );
}

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState<ListingStep>("location");
  const [draft, setDraft] = useState<ListingDraft>(emptyDraft);
  const [mapPoint, setMapPoint] = useState<MapPoint | null>(null);

  function update(key: keyof ListingDraft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function openAddressSearch() {
    await loadScript(postcodeSrc);
    const postcode = window.daum?.Postcode;
    if (!postcode) return;

    new postcode({
      oncomplete: async (data) => {
        const address = data.roadAddress || data.jibunAddress;
        update("address", address);
        setMapPoint(await searchAddressPoint(address));
      },
    }).open();
  }

  const title = step === "location" ? "분석할 매물의 위치를 알려주세요." : "매물의 계약 조건을 입력해주세요.";

  return (
    <section className="listing-new">
      <div className="listing-head">
        <Link className="listing-back" href="/home">
          <img src="/icon.svg/arrow-left-2.svg" alt="" />
          목록으로
        </Link>
        <h1 className="listing-title">{title}</h1>
      </div>
      <div className="listing-fields">
        {step === "location" ? (
          <LocationFields draft={draft} mapPoint={mapPoint} onChange={update} onSearchAddress={openAddressSearch} />
        ) : (
          <ContractFields draft={draft} onChange={update} />
        )}
      </div>
      <div className="listing-submit">
        {step === "location" ? (
          <Button onClick={() => setStep("contract")}>다음으로</Button>
        ) : (
          <Button variant="brand" onClick={() => router.push("/analysis/loading")}>
            분석 시작하기
          </Button>
        )}
      </div>
    </section>
  );
}