import React from 'react';
import { CheckCircle2, Target, ShieldCheck, Users } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AnimatedHeroEngineDemo } from './AnimatedHeroEngineDemo';
import { useHeroAnimation } from '../hooks/useHeroAnimation';
import { EMBLEM_URL } from './Header';

interface LandingViewProps {
  language: Language;
  onStartEligibility: () => void;
  onNavigateToTransparency: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  language,
  onStartEligibility,
  onNavigateToTransparency
}) => {
  const t = TRANSLATIONS[language];
  const {
    typedTextRef,
    schemesCountRef,
    parametersCountRef,
    chipRefs,
    ruleRowRefs,
    rulesStatusRef,
    resultCardRef,
    restart
  } = useHeroAnimation();

  return (
    <div className="flex flex-col w-full" id="landing-view">
      {/* ================= HERO SECTION ================= */}
      <section className="w-full max-w-[75rem] mx-auto px-4 lg:px-10 pt-6 pb-12 lg:pt-8 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Value Proposition & Call to Action */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
            {/* Main Headline with Animated Typing Effect (PHASE 1) */}
            <div className="space-y-2">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] text-[#001d37] tracking-tight font-bold leading-tight min-h-[5.5rem] sm:min-h-[6rem] lg:min-h-[6.5rem]">
                <span>Find the Right Schemes.</span>
                <br />
                <span className="text-[#D85A30] font-semibold">
                  <span ref={typedTextRef}>Check your eligibility.</span>
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[#43474d] max-w-xl pt-1 leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Call to Action & Micro-trust */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Primary CTA: Triggers eligibility check flow and restarts animation sequence */}
                <button
                  type="button"
                  id="hero-check-eligibility-cta"
                  onClick={() => {
                    restart();
                    onStartEligibility();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#16324f] text-white text-base font-semibold shadow-xs hover:shadow-md hover:bg-[#10243a] transition-all transform active:scale-[0.99] cursor-pointer group"
                >
                  <span>Check your eligibility →</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#43474d] pt-1">
                <CheckCircle2 className="w-4 h-4 text-[#2F6B4F] shrink-0" />
                <span className="font-semibold text-[#1b1c18]">{t.noLogin}</span>
                <span className="text-[#c3c6ce]">•</span>
                <span>{t.twoMinutes}</span>
              </div>
            </div>

            {/* Live Platform Stats Strip (PHASE 2: Counter animation) */}
            <div className="pt-2">
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#f5f3ed] border border-[#c3c6ce]/30">
                {/* Schemes Count Up (850+) */}
                <div className="flex flex-col">
                  <span
                    ref={schemesCountRef}
                    className="text-xl sm:text-2xl text-[#001d37] font-bold tracking-tight font-heading tabular-nums"
                  >
                    0+
                  </span>
                  <span className="text-[11px] text-[#43474d] leading-tight mt-0.5">
                    {t.statSchemesLabel}
                  </span>
                </div>

                {/* Parameters Count Up (42) */}
                <div className="flex flex-col border-l border-[#c3c6ce]/30 pl-3">
                  <span
                    ref={parametersCountRef}
                    className="text-xl sm:text-2xl text-[#001d37] font-bold tracking-tight font-heading tabular-nums"
                  >
                    0
                  </span>
                  <span className="text-[11px] text-[#43474d] leading-tight mt-0.5">
                    {t.statRulesLabel}
                  </span>
                </div>

                {/* Privacy Stat: Zero Data Stored */}
                <div className="flex flex-col border-l border-[#c3c6ce]/30 pl-3">
                  <span className="text-xl sm:text-2xl text-[#001d37] font-bold tracking-tight font-heading">
                    {t.statData}
                  </span>
                  <span className="text-[11px] text-[#43474d] leading-tight mt-0.5">
                    {t.statDataLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Eligibility Engine Demo */}
          <div className="lg:col-span-6" id="how-it-works">
            <AnimatedHeroEngineDemo
              chipRefs={chipRefs}
              ruleRowRefs={ruleRowRefs}
              rulesStatusRef={rulesStatusRef}
              resultCardRef={resultCardRef}
            />
          </div>
        </div>
      </section>

      {/* ================= ABOUT SCHEMESETU SECTION ================= */}
      <section id="about" className="w-full pt-8 pb-14 border-t border-[#c3c6ce]/30 bg-[#fbf9f3]">
        <div className="max-w-[75rem] mx-auto px-4 lg:px-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3.5">
              <img
                src={EMBLEM_URL}
                alt="SchemeSetu Logo"
                className="w-10 h-10 rounded-lg shadow-xs shrink-0 object-contain"
              />
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#16324F] font-bold tracking-tight">
                {t.aboutTitle}
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#43474d] leading-relaxed">
              {t.aboutDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col justify-between p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#16324f]/10 flex items-center justify-center text-[#16324F] mb-2">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#C0392B]">
                  OUR MISSION
                </span>
                <h3 className="text-lg text-[#16324F] font-bold mt-1">{t.missionTitle}</h3>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed mt-2">
                  {t.missionDesc}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center text-[#2F6B4F] mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#C0392B]">
                  TRANSPARENCY
                </span>
                <h3 className="text-lg text-[#16324F] font-bold mt-1">
                  {t.transparencyCardTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed mt-2">
                  {t.transparencyCardDesc}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#45617d]/10 flex items-center justify-center text-[#45617d] mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#C0392B]">
                  ACCESSIBILITY
                </span>
                <h3 className="text-lg text-[#16324F] font-bold mt-1">
                  {t.accessibilityTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed mt-2">
                  {t.accessibilityDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
