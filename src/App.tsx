/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AppView, Language, Scheme, SchemeMatch, UserProfile } from './types';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { EligibilityFlow } from './components/EligibilityFlow';
import { ResultsView } from './components/ResultsView';
import { RepositoryView } from './components/RepositoryView';
import { TransparencyView } from './components/TransparencyView';
import { SchemeModal } from './components/SchemeModal';
import { CitizenInfoModal } from './components/CitizenInfoModal';
import { Footer } from './components/Footer';
import { evaluateEligibility } from './utils/rulesEngine';

export const INITIAL_PROFILE: UserProfile = {
  supportGoal: 'New Business',
  projectCost: 1000000,
  familyIncome: 350000,
  age: 29,
  gender: 'Female',
  priorityCategory: 'Yes',
  state: 'Maharashtra',
  district: 'Pune',
  locationType: 'Rural',
  socialCategory: 'OBC',
  occupation: 'Aspiring Entrepreneur',
  businessType: 'Manufacturing',
  businessStage: 'New',
  turnover: 0
};

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [matches, setMatches] = useState<SchemeMatch[]>(() => evaluateEligibility(INITIAL_PROFILE));
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleNavigate = (view: AppView) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  const handleStartEligibility = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('flow');
  };

  const handleSubmitEvaluation = () => {
    setIsEvaluating(true);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = prefersReducedMotion ? 400 : 1600;

    setTimeout(() => {
      const results = evaluateEligibility(profile);
      setMatches(results);
      setIsEvaluating(false);
    }, delay);
  };

  const handleResetSession = () => {
    setProfile(INITIAL_PROFILE);
    setMatches(evaluateEligibility(INITIAL_PROFILE));
    setIsCitizenModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f3] text-[#1b1c18]">
      {/* Top Fixed Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        language={language}
        onToggleLanguage={setLanguage}
        onStartEligibility={handleStartEligibility}
        onOpenQuickInfo={() => setIsCitizenModalOpen(true)}
      />

      {/* Main Viewport Body */}
      <main className="flex-1 w-full pt-20">
        {currentView === 'landing' && (
          <LandingView
            language={language}
            onStartEligibility={handleStartEligibility}
            onNavigateToTransparency={() => handleNavigate('transparency')}
          />
        )}

        {currentView === 'flow' && (
          <EligibilityFlow
            profile={profile}
            isEvaluating={isEvaluating}
            onChangeProfile={setProfile}
            onBackToHome={() => handleNavigate('landing')}
            onSubmitEvaluation={handleSubmitEvaluation}
          />
        )}

        {currentView === 'results' && (
          <ResultsView
            matches={matches}
            profile={profile}
            isEvaluating={isEvaluating}
            onModifyProfile={() => handleNavigate('flow')}
            onReturnHome={() => handleNavigate('landing')}
            onOpenSchemeModal={setSelectedScheme}
          />
        )}

        {currentView === 'schemes' && (
          <RepositoryView
            onStartEligibility={handleStartEligibility}
            onOpenSchemeModal={setSelectedScheme}
          />
        )}

        {currentView === 'transparency' && (
          <TransparencyView onStartEligibility={handleStartEligibility} />
        )}
      </main>

      {/* Persistent Civic Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Scheme Detail Modal */}
      <SchemeModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />

      {/* Citizen Session & Privacy Status Modal */}
      <CitizenInfoModal
        isOpen={isCitizenModalOpen}
        onClose={() => setIsCitizenModalOpen(false)}
        profile={profile}
        onResetSession={handleResetSession}
        onStartEvaluation={handleStartEligibility}
      />
    </div>
  );
}
