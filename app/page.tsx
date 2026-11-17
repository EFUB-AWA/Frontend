// app/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RootLandingPage() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* 1. 상단 메인 히어로 섹션 */}
      <section className="pt-20 pb-16 px-4 text-center flex flex-col items-center">
        {/* 상단 서브 타이틀 */}
        <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-6">
          이 매장, 내가 감당할 수 있을지 궁금하다면?
        </h2>

        {/* 서비스 빅 로고 영역 (Group 2.svg 적용) */}
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/logo.svg/Group 2.svg"
            alt="이리ON 로고"
            width={180}
            height={60}
            priority
            className="h-12 md:h-16 w-auto object-contain"
          />
        </div>

        {/* 설명 문구 */}
        <p className="text-sm md:text-base text-gray-500 mb-10 max-w-lg">
          내 자금과 상권 데이터를 바탕으로, 계약 안정성과 생존 가능성을 확인해보세요.
        </p>

        {/* 메인 CTA 버튼 */}
        <button
          type="button"
          onClick={handleLoginRedirect}
          className="px-8 py-4 bg-[#111111] text-white font-medium rounded-2xl shadow-md hover:bg-black transition-all flex items-center gap-2 cursor-pointer text-base"
        >
          로그인하고 내 창업 조건 분석하기
          <span className="text-lg">→</span>
        </button>
      </section>

      {/* 2. 바로가기/추천 카드 버튼 영역 (4개) */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <button
              key={item}
              type="button"
              onClick={handleLoginRedirect}
              className="py-5 px-4 bg-[#F0F6FF] hover:bg-[#E2EFFF] text-blue-600 font-medium rounded-2xl text-sm transition-all text-center shadow-xs border border-blue-50/80 cursor-pointer"
            >
              로그인하고 내 창업 조건 분석하기
            </button>
          ))}
        </div>
      </section>

      {/* 3. 서비스 이용 방법 안내 섹션 (카드 사이에 원형 화살표 추가) */}
      <section className="max-w-6xl mx-auto px-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-8">
          이렇게 이용할 수 있어요
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-center">
          {/* Step 01 카드 */}
          <div className="p-8 bg-gray-50/80 rounded-3xl border border-gray-100 flex flex-col justify-between h-48 relative">
            <div>
              <span className="text-2xl font-extrabold text-gray-900 mb-3 block">01</span>
              <p className="text-sm md:text-base text-gray-700 font-medium">
                내가 고려하고 있는 창업 조건을 입력해주세요.
              </p>
            </div>
            {/* 1번과 2번 카드 사이 화살표 (데스크톱 기준 우측 중앙 배치) */}
            <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Step 02 카드 */}
          <div className="p-8 bg-gray-50/80 rounded-3xl border border-gray-100 flex flex-col justify-between h-48 relative">
            <div>
              <span className="text-2xl font-extrabold text-gray-900 mb-3 block">02</span>
              <p className="text-sm md:text-base text-gray-700 font-medium">
                후보로 생각하고 있는 매물의 위치를 알려주세요.
              </p>
            </div>
            {/* 2번과 3번 카드 사이 화살표 (데스크톱 기준 우측 중앙 배치) */}
            <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Step 03 카드 */}
          <div className="p-8 bg-gray-50/80 rounded-3xl border border-gray-100 flex flex-col justify-between h-48 relative">
            <div>
              <span className="text-2xl font-extrabold text-gray-900 mb-3 block">03</span>
              <p className="text-sm md:text-base text-gray-700 font-medium">
                분석 결과를 확인하고 AI에게 조언을 구해보세요.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}