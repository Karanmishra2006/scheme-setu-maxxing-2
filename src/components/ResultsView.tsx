import React, { useState } from 'react';
import {
  CheckCircle2,
  SlidersHorizontal,
  Home,
  FileCheck,
  UserCheck,
  Building,
  ExternalLink,
  Printer,
  Search,
  AlertTriangle,
  Info,
  Layers
} from 'lucide-react';
import { Scheme, SchemeMatch, UserProfile } from '../types';
import { EvaluationSkeletonLoader } from './EvaluationSkeletonLoader';

interface ResultsViewProps {
  matches: SchemeMatch[];
  profile: UserProfile;
  isEvaluating?: boolean;
  onModifyProfile: () => void;
  onReturnHome: () => void;
  onOpenSchemeModal: (scheme: Scheme) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  matches,
  profile,
  isEvaluating = false,
  onModifyProfile,
  onReturnHome,
  onOpenSchemeModal
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (isEvaluating) {
    return <EvaluationSkeletonLoader profile={profile} />;
  }

  const filteredMatches = matches.filter((m) => {
    const matchesCat = filterCategory === 'all' || m.scheme.category === filterCategory;
    const matchesSearch =
      m.scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.statutoryJustification.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="results-view" className="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-[#fbf9f3] pb-16">
      {/* Header Strip */}
      <div className="w-full bg-[#f5f3ed] border-t border-b border-[#c3c6ce]/30 py-4">
        <div className="max-w-[75rem] mx-auto px-4 lg:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#2F6B4F] font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Deterministic Audit</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#001d37] font-bold tracking-tight">
              Your Scheme Matches
            </h2>
            <p className="text-sm text-[#43474d] mt-0.5">
              We found government schemes that directly match your statutory profile and eligibility criteria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#c3c6ce]/60 text-[#1b1c18] text-xs font-semibold hover:bg-[#f0eee8] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#45617d]" />
              <span>Print Audit</span>
            </button>
            <button
              type="button"
              onClick={onModifyProfile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#eae8e2] text-[#1b1c18] text-xs font-semibold hover:bg-[#e4e2dd] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#45617d]" />
              <span>Modify Profile</span>
            </button>
            <button
              type="button"
              onClick={onReturnHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#16324F] text-white text-xs font-semibold hover:bg-[#10243a] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-[75rem] w-full mx-auto px-4 lg:px-10 pt-6 space-y-6">
        {/* Metric Strip Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6 text-[#2F6B4F]" />
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl text-[#001d37] font-bold leading-tight block">
                {matches.length} Qualified Schemes
              </span>
              <span className="text-xs text-[#43474d]">Evaluated across 850+ gazetted programs</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-[#c3c6ce]/30 pt-3 md:pt-0">
            <div className="w-11 h-11 rounded-full bg-[#45617d]/10 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6 text-[#45617d]" />
            </div>
            <div>
              <span className="text-sm sm:text-base text-[#001d37] font-bold leading-tight block">
                {profile.state} • {profile.locationType} • {profile.socialCategory}
              </span>
              <span className="text-xs text-[#43474d]">
                {profile.gender} • Age {profile.age} • {profile.occupation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-[#c3c6ce]/30 pt-3 md:pt-0">
            <div className="w-11 h-11 rounded-full bg-[#16324f]/10 flex items-center justify-center shrink-0">
              <Building className="w-6 h-6 text-[#16324F]" />
            </div>
            <div>
              <span className="text-sm sm:text-base text-[#001d37] font-bold leading-tight block">
                Rule Status: 100% Deterministic
              </span>
              <span className="text-xs text-[#2F6B4F] font-semibold">Zero predictive hallucinations</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#43474d]" />
            <input
              type="text"
              placeholder="Search within matched schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#c3c6ce]/60 bg-[#fbf9f3] text-sm text-[#1b1c18] focus:outline-hidden focus:border-[#16324F]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Matches' },
              { id: 'MSME', label: 'MSME' },
              { id: 'Agriculture', label: 'Agriculture' },
              { id: 'Social', label: 'Women & Social' },
              { id: 'Education', label: 'Education' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#16324F] text-white shadow-xs'
                    : 'bg-[#f5f3ed] text-[#43474d] hover:bg-[#eae8e2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matched Scheme Cards List */}
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            const isHighFit = match.fitPercentage >= 90;

            return (
              <div
                key={match.scheme.id}
                className={`p-5 sm:p-6 rounded-xl bg-white border shadow-xs hover:shadow-md transition-shadow space-y-4 ${
                  isHighFit
                    ? 'border-2 border-[#2F6B4F]/40'
                    : 'border-[#c3c6ce]/30'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1 ${
                          isHighFit
                            ? 'bg-[#2F6B4F]/15 text-[#2F6B4F]'
                            : 'bg-[#ffdad6] text-[#C0392B]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> {match.fitPercentage}% Match ({match.fitPercentage}/100)
                      </span>
                      <span className="text-[#c3c6ce] text-[12px]">•</span>
                      <span className="text-xs text-[#43474d] uppercase font-semibold tracking-wider">
                        {match.scheme.sectorType}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg sm:text-xl text-[#001d37] font-bold tracking-tight">
                      {match.scheme.title}
                    </h3>
                    <span className="text-xs text-[#45617d] font-semibold block">
                      {match.scheme.ministry}
                    </span>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <span className="text-base sm:text-lg text-[#2F6B4F] font-bold block">
                      {match.subsidyEstimate || match.scheme.benefitHeadline}
                    </span>
                    <span className="text-xs text-[#43474d]">
                      {match.scheme.maxCeilingText}
                    </span>
                  </div>
                </div>

                {/* Scheme Highlights / Benefits */}
                <p className="text-sm text-[#43474d] leading-relaxed">
                  {match.scheme.description}
                </p>

                {/* Statutory Justification */}
                <div className="p-3 rounded-lg bg-[#f5f3ed] border border-[#c3c6ce]/20 space-y-1">
                  <span className="text-[11px] uppercase font-bold text-[#16324F] tracking-wider block">
                    Statutory Rule Match Rationale:
                  </span>
                  <p className="text-xs text-[#1b1c18] leading-relaxed">
                    {match.statutoryJustification}
                  </p>
                </div>

                {/* Matched Criteria Checklist */}
                <div className="p-3 rounded-lg bg-[#fbf9f3] border border-[#c3c6ce]/20 space-y-2">
                  <span className="text-[11px] uppercase font-bold text-[#43474d] tracking-wider block">
                    Verified Parameters:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {match.matchedCriteria.map((crit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[#1b1c18]">
                        <CheckCircle2 className="w-4 h-4 text-[#2F6B4F] shrink-0" />
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>

                  {match.prerequisites.length > 0 && (
                    <div className="pt-2 border-t border-[#c3c6ce]/20 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#C0392B] tracking-wider block">
                        Prerequisites &amp; Action Notes:
                      </span>
                      {match.prerequisites.map((pre, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-[#43474d]">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#C0392B] shrink-0 mt-0.5" />
                          <span>{pre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Bottom Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#c3c6ce]/20">
                  <button
                    type="button"
                    onClick={() => onOpenSchemeModal(match.scheme)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16324F] hover:text-[#C0392B] transition-colors cursor-pointer"
                  >
                    <Info className="w-4 h-4" />
                    <span>View Scheme Guidelines &amp; Documents</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={match.scheme.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#16324F] text-white text-xs font-semibold hover:bg-[#10243a] transition-colors shadow-xs"
                    >
                      <span>Visit Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredMatches.length === 0 && (
            <div className="text-center py-12 p-6 rounded-xl bg-white border border-[#c3c6ce]/30">
              <Layers className="w-10 h-10 text-[#74777e] mx-auto mb-2" />
              <h3 className="text-base font-bold text-[#001d37]">No schemes found matching filter</h3>
              <p className="text-xs text-[#43474d] mt-1">
                Try switching the category filter or searching with a different keyword.
              </p>
            </div>
          )}
        </div>

        {/* Trust & Privacy Assurance Bar */}
        <div className="p-4 rounded-xl bg-[#f5f3ed] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#43474d] border border-[#c3c6ce]/30">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
            <span className="flex items-center gap-1 text-[#1b1c18] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B4F]" /> No login required
            </span>
            <span className="text-[#c3c6ce]">•</span>
            <span className="flex items-center gap-1 text-[#1b1c18] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B4F]" /> Privacy-first in-browser evaluation
            </span>
            <span className="text-[#c3c6ce]">•</span>
            <span className="flex items-center gap-1 text-[#1b1c18] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B4F]" /> Verified Gazette criteria
            </span>
          </div>

          <button
            type="button"
            onClick={onReturnHome}
            className="text-xs text-[#45617d] hover:text-[#16324F] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
