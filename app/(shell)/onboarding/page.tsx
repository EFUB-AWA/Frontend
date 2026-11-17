// app/(shell)/onboarding/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Step = 'basic' | 'fund' | 'expense';

interface OnboardingForm {
  title: string;
  businessType: string;
  subBusinessType: string;
  region: string;
  currentCapital: string;
  availableCapital: string;
  expectedLoan: string;
  expenseMode: 'auto' | 'manual';
  monthlyLabor: string;
  monthlyMaterial: string;
  monthlyFixed: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [form, setForm] = useState<OnboardingForm>({
    title: '',
    businessType: '',
    subBusinessType: '',
    region: '',
    currentCapital: '',
    availableCapital: '',
    expectedLoan: '',
    expenseMode: 'manual',
    monthlyLabor: '',
    monthlyMaterial: '',
    monthlyFixed: '',
  });

  const handleChange = (field: keyof OnboardingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const totalExpense =
    Number(form.monthlyLabor || 0) +
    Number(form.monthlyMaterial || 0) +
    Number(form.monthlyFixed || 0);

  // 각 탭이 완료되었는지 여부 확인 함수
  const isBasicCompleted = Boolean(form.title && form.businessType && form.region);
  const isFundCompleted = Boolean(form.availableCapital);

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* 상단 타이틀 영역 */}
      <div className="pt-16 pb-8 text-center px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {currentStep === 'basic' && '어떤 창업을 준비하고 계신가요?'}
          {currentStep === 'fund' && '창업에 사용할 수 있는 자금을 알려주세요.'}
          {currentStep === 'expense' && '창업에 사용할 수 있는 자금을 알려주세요.'}
        </h1>
        <p className="text-sm text-gray-500">
          {currentStep === 'basic' && '기본 정보를 먼저 알려주세요.'}
          {currentStep === 'fund' && '자금 정보를 입력해주세요.'}
          {currentStep === 'expense' && '예상치로 작성해도 괜찮아요.'}
        </p>
      </div>

      {/* 상단 탭 네비게이션 (완료된 단계 파란색 + 체크 표시) */}
      <div className="flex justify-center items-center gap-3 mb-10 px-4">
        {/* 기본 정보 탭 */}
        <button
          type="button"
          onClick={() => setCurrentStep('basic')}
          className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            currentStep === 'basic' || isBasicCompleted
              ? 'bg-[#3b82f6] text-white shadow-sm'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          기본 정보 {isBasicCompleted && currentStep !== 'basic' && '✓'}
        </button>

        {/* 자금 탭 */}
        <button
          type="button"
          onClick={() => setCurrentStep('fund')}
          className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            currentStep === 'fund' || isFundCompleted
              ? 'bg-[#3b82f6] text-white shadow-sm'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          자금 {isFundCompleted && currentStep !== 'fund' && '✓'}
        </button>

        {/* 운영비 탭 */}
        <button
          type="button"
          onClick={() => setCurrentStep('expense')}
          className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            currentStep === 'expense'
              ? 'bg-[#3b82f6] text-white shadow-sm'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          운영비
        </button>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-2xl mx-auto bg-white px-4 py-2">
        
        {/* Step 1: 기본 정보 */}
        {currentStep === 'basic' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">창업 조건 제목</label>
              <Input
                placeholder="20261010 연남동"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                helperText="이름을 구별할 수 있도록 작성해주세요."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">업종</label>
              <Input
                placeholder="카페/디저트, 요식업, 소품샵 등"
                value={form.businessType}
                onChange={(e) => handleChange('businessType', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">세부 업종</label>
              <Input
                placeholder="카페, 요리주점 등"
                value={form.subBusinessType}
                onChange={(e) => handleChange('subBusinessType', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">희망 지역</label>
              <Input
                placeholder="서울시 마포구, 서울시 서대문구 등"
                value={form.region}
                onChange={(e) => handleChange('region', e.target.value)}
              />
            </div>

            {/* 버튼 가운데 정렬 */}
            <div className="flex justify-center pt-8">
              <Button variant="black" onClick={() => setCurrentStep('fund')} className="w-full md:w-auto px-12 py-3.5 rounded-xl font-medium bg-[#111] text-white hover:bg-black">
                다음으로
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: 자금 정보 */}
        {currentStep === 'fund' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">현재 내가 보유하고 있는 자금</label>
              <Input
                placeholder="숫자만 입력"
                unit="0원"
                value={form.currentCapital}
                onChange={(e) => handleChange('currentCapital', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">창업에 사용할 수 있는 자금</label>
              <Input
                placeholder="숫자만 입력"
                unit="0원"
                value={form.availableCapital}
                onChange={(e) => handleChange('availableCapital', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">대출 예정 금액</label>
              <Input
                placeholder="숫자만 입력"
                unit="0원"
                value={form.expectedLoan}
                onChange={(e) => handleChange('expectedLoan', e.target.value)}
              />
            </div>

            {/* 버튼 가운데 정렬 (간격 유지) */}
            <div className="flex justify-center gap-4 pt-8">
              <Button variant="gray" onClick={() => setCurrentStep('basic')} className="w-1/2 md:w-40 py-3.5 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                이전
              </Button>
              <Button variant="black" onClick={() => setCurrentStep('expense')} className="w-1/2 md:w-40 py-3.5 rounded-xl font-medium bg-[#111] text-white hover:bg-black">
                다음으로
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: 운영비 */}
        {currentStep === 'expense' && (
          <div className="flex flex-col gap-6">
            {/* 상단 서브 토글 버튼 */}
            <div className="flex gap-2 p-1 bg-gray-50/60 rounded-xl mb-2">
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  form.expenseMode === 'auto'
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                    : 'text-gray-500 hover:text-gray-800 border border-transparent'
                }`}
                onClick={() => handleChange('expenseMode', 'auto')}
              >
                업종 평균값으로 계산하기
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  form.expenseMode === 'manual'
                    ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                    : 'text-gray-500 hover:text-gray-800 border border-transparent'
                }`}
                onClick={() => handleChange('expenseMode', 'manual')}
              >
                직접 입력하기
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">월 인건비</label>
              <Input
                placeholder="숫자만 입력"
                unit="0원"
                value={form.monthlyLabor}
                onChange={(e) => handleChange('monthlyLabor', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">재료비</label>
              <Input
                placeholder="숫자만 입력"
                unit="0원"
                value={form.monthlyMaterial}
                onChange={(e) => handleChange('monthlyMaterial', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-800">기타 고정비 (임대료, 관리비 등)</label>
              <Input
                placeholder="숫자만 입력"
                unit="0원"
                value={form.monthlyFixed}
                onChange={(e) => handleChange('monthlyFixed', e.target.value)}
              />
            </div>

            {/* 예상 월 운영비 결과 박스 */}
            <div className="mt-4 p-5 bg-gray-50/80 rounded-2xl border border-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  🧮 예상 월 운영비
                </span>
                <span className="text-xs text-gray-400 bg-gray-200/60 px-2.5 py-0.5 rounded-md">
                  자동계산
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between pt-2 border-t border-gray-200/60 gap-2">
                <div className="text-xl font-bold text-gray-900">
                  총 <span className="text-blue-600 font-extrabold">{totalExpense.toLocaleString()}</span> 만원
                </div>
                <div className="text-xs text-gray-500">
                  인건비 {form.monthlyLabor || 0} 만원 + 재료비 {form.monthlyMaterial || 0} 만원 + 기타 고정비 {form.monthlyFixed || 0} 만원
                </div>
              </div>
            </div>

            {/* 버튼 가운데 정렬 (간격 유지) */}
            <div className="flex justify-center gap-4 pt-8">
              <Button variant="gray" onClick={() => setCurrentStep('fund')} className="w-1/2 md:w-40 py-3.5 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                이전
              </Button>
              <Button
                variant="black"
                onClick={() => {
                  alert('온보딩 정보가 성공적으로 저장되었습니다!');
                  console.log('Final Form Data:', form);
                }}
                className="w-1/2 md:w-40 py-3.5 rounded-xl font-medium bg-[#111] text-white hover:bg-black"
              >
                저장하기
              </Button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}