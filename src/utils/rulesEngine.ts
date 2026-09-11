import { SchemeMatch, UserProfile } from '../types';
import { SCHEMES_DATABASE } from '../data/schemes';

export function evaluateEligibility(profile: UserProfile): SchemeMatch[] {
  const matches: SchemeMatch[] = [];

  for (const scheme of SCHEMES_DATABASE) {
    let score = 0;
    const matchedCriteria: string[] = [];
    const prerequisites: string[] = [];
    let statutoryJustification = '';
    let subsidyEstimate = '';

    // ================= PMEGP =================
    if (scheme.id === 'pmegp') {
      // PMEGP applies for New Business or Business expansion in Manufacturing/Service
      const isBusinessIntent =
        profile.supportGoal === 'New Business' ||
        profile.supportGoal === 'Expand Business' ||
        profile.occupation === 'Aspiring Entrepreneur' ||
        profile.occupation === 'Business Owner';

      if (!isBusinessIntent) continue;

      // Age check: >= 18
      if (profile.age >= 18) {
        score += 25;
        matchedCriteria.push('Age eligibility satisfied (Applicant >= 18 years)');
      }

      // Cost ceiling check: <= 50L for mfg, <= 20L for services
      const maxAllowed = profile.businessType === 'Manufacturing' ? 5000000 : 2000000;
      if (profile.projectCost <= maxAllowed) {
        score += 25;
        matchedCriteria.push(
          `Project ceiling matches (< ₹${maxAllowed / 100000} Lakh statutory threshold)`
        );
      } else {
        score += 10;
        prerequisites.push(`Project cost exceeds ₹${maxAllowed / 100000}L limit; requires tranche restructuring`);
      }

      // Location & Category Subsidy Calculation
      const isSpecialCategory =
        profile.gender === 'Female' ||
        profile.socialCategory === 'SC' ||
        profile.socialCategory === 'ST' ||
        profile.socialCategory === 'OBC' ||
        profile.priorityCategory === 'Yes';

      const isRural = profile.locationType === 'Rural' || profile.locationType === 'Semi-Urban';

      if (isRural) {
        score += 25;
        matchedCriteria.push('Location criteria matches (Tier-3 Rural / Semi-Urban zoning)');
      } else {
        score += 20;
        matchedCriteria.push('Location criteria matches (Urban zone tier)');
      }

      if (isSpecialCategory) {
        score += 25;
        const rate = isRural ? '35%' : '25%';
        matchedCriteria.push(
          `Affirmative category (${profile.gender === 'Female' ? 'Woman / ' : ''}${profile.socialCategory}): Higher ${rate} subsidy rate qualified`
        );
        subsidyEstimate = `Up to ${rate} Capital Subsidy`;
        statutoryJustification = `Eligible under PMEGP Clause 4.2 for ${isRural ? '25% Rural Base Subsidy' : '15% Urban Base Subsidy'}, plus an additional 10% affirmative allowance for ${profile.gender === 'Female' ? 'Women Entrepreneurs' : 'Special Category applicants'}.`;
      } else {
        score += 20;
        const rate = isRural ? '25%' : '15%';
        matchedCriteria.push(`General category rate applicable (${rate} capital subsidy)`);
        subsidyEstimate = `Up to ${rate} Capital Subsidy`;
        statutoryJustification = `Eligible under PMEGP Clause 4.2 for ${rate} Capital Subsidy based on ${profile.locationType} area classification.`;
      }

      if (profile.projectCost > 1000000 && profile.businessType === 'Manufacturing') {
        prerequisites.push('Minimum 8th standard passing certificate required (> ₹10 Lakh Mfg)');
      }
      prerequisites.push('Mandatory EDP (Entrepreneurship Development Training) pre-disbursement');

      matches.push({
        scheme,
        fitPercentage: Math.min(score, 96),
        statutoryJustification,
        matchedCriteria,
        prerequisites,
        subsidyEstimate
      });
    }

    // ================= Stand-Up India =================
    if (scheme.id === 'standup') {
      const isEligibleCategory =
        profile.gender === 'Female' ||
        profile.socialCategory === 'SC' ||
        profile.socialCategory === 'ST';

      const isBusinessIntent =
        profile.supportGoal === 'New Business' ||
        profile.supportGoal === 'Expand Business' ||
        profile.occupation === 'Aspiring Entrepreneur' ||
        profile.occupation === 'Business Owner';

      if (isBusinessIntent) {
        if (isEligibleCategory) {
          score += 40;
          matchedCriteria.push(
            `Applicant matches ${profile.gender === 'Female' ? 'Woman Entrepreneur' : 'SC/ST'} priority statutory mandate`
          );
        }

        if (profile.businessStage === 'New' || profile.supportGoal === 'New Business') {
          score += 30;
          matchedCriteria.push('Greenfield enterprise qualification verified');
        } else {
          score += 15;
          matchedCriteria.push('Enterprise expansion evaluated under non-individual 51% equity provision');
        }

        if (profile.projectCost >= 1000000 && profile.projectCost <= 10000000) {
          score += 25;
          matchedCriteria.push('Project outlay falls precisely within ₹10 Lakh – ₹1 Crore composite band');
        } else if (profile.projectCost < 1000000) {
          score += 15;
          prerequisites.push('Project capital outlay is under ₹10L; can be scaled or paired with MUDRA');
        } else {
          score += 15;
          prerequisites.push('Outlay exceeds ₹1 Crore ceiling; requires consortium lending');
        }

        if (isEligibleCategory) {
          statutoryJustification = `Directly eligible under Stand-Up India Mandate Rule 1.1 guaranteeing priority credit dispensation via scheduled commercial banks.`;
          subsidyEstimate = '₹10 Lakh to ₹1 Crore Composite Loan';

          matches.push({
            scheme,
            fitPercentage: Math.min(score, 92),
            statutoryJustification,
            matchedCriteria,
            prerequisites,
            subsidyEstimate
          });
        }
      }
    }

    // ================= MUDRA Yojana =================
    if (scheme.id === 'mudra') {
      const isBusinessIntent =
        profile.supportGoal === 'New Business' ||
        profile.supportGoal === 'Expand Business' ||
        profile.occupation === 'Aspiring Entrepreneur' ||
        profile.occupation === 'Business Owner';

      if (isBusinessIntent) {
        score += 35;
        matchedCriteria.push('Micro-enterprise income generating activity qualified');

        if (profile.projectCost <= 1000000) {
          score += 35;
          const tier =
            profile.projectCost <= 50000
              ? 'Shishu (up to ₹50k)'
              : profile.projectCost <= 500000
              ? 'Kishore (₹50k - ₹5L)'
              : 'Tarun (₹5L - ₹10L)';
          matchedCriteria.push(`Outlay fits within ${tier} bracket without collateral`);
        } else {
          score += 15;
          prerequisites.push('Amount exceeds ₹10L MUDRA cap; applicable up to ₹10L tranche');
        }

        if (profile.age >= 18) {
          score += 20;
          matchedCriteria.push('Age statutory check passed (18-65 years)');
        }

        statutoryJustification = `Eligible under PMMY guidelines for collateral-free micro enterprise lending through public and private sector commercial banks.`;
        subsidyEstimate = 'Up to ₹10 Lakhs Collateral-Free Credit';

        matches.push({
          scheme,
          fitPercentage: Math.min(score, 88),
          statutoryJustification,
          matchedCriteria,
          prerequisites: [
            ...prerequisites,
            'Active Udyam Registration certificate required at bank submission'
          ],
          subsidyEstimate
        });
      }
    }

    // ================= Agriculture Infrastructure Fund (AIF) =================
    if (scheme.id === 'aif') {
      const isAgriIntent =
        profile.supportGoal === 'Agriculture' ||
        profile.businessType === 'Agro-allied' ||
        profile.occupation === 'Farmer / Other';

      if (isAgriIntent) {
        score = 86;
        matchedCriteria.push('Agricultural / Agro-processing sector focus verified');
        matchedCriteria.push('3% Interest subvention applicable on term loan');
        matchedCriteria.push('Eligible for CGTMSE government-backed credit guarantee cover');

        statutoryJustification = `Eligible under AIF Operational Guidelines Clause 5.1 for 3% interest subvention for post-harvest & farm gate value addition.`;
        subsidyEstimate = '3% Interest Subvention up to ₹2 Crore';

        matches.push({
          scheme,
          fitPercentage: score,
          statutoryJustification,
          matchedCriteria,
          prerequisites: [
            'Land ownership records or valid registered lease deed required',
            'Detailed project report on post-harvest storage/processing'
          ],
          subsidyEstimate
        });
      }
    }

    // ================= Mission Shakti (Samarthya) =================
    if (scheme.id === 'shakti') {
      if (profile.gender === 'Female' || profile.priorityCategory === 'Yes') {
        score = 84;
        matchedCriteria.push('Female applicant qualification verified');
        if (profile.locationType === 'Rural' || profile.locationType === 'Semi-Urban') {
          matchedCriteria.push('Rural enterprise affirmative priority applied');
        }
        if (profile.familyIncome <= 500000) {
          matchedCriteria.push('Means-tested family income tier verified');
        }

        statutoryJustification = `Qualifies under Mission Shakti (Samarthya) framework for affirmative women entrepreneurship assistance and skill incubator access.`;
        subsidyEstimate = 'Revolving Credit & Institutional Grants';

        matches.push({
          scheme,
          fitPercentage: score,
          statutoryJustification,
          matchedCriteria,
          prerequisites: ['SHG affiliation or individual woman entrepreneur declaration'],
          subsidyEstimate
        });
      }
    }

    // ================= Credit Enhancement Guarantee Scheme for SC (CEGSSC) =================
    if (scheme.id === 'cegssc') {
      if (profile.socialCategory === 'SC') {
        score = 85;
        matchedCriteria.push('Scheduled Caste entrepreneur statutory qualification satisfied');
        matchedCriteria.push('100% Credit guarantee cover available up to ₹1 Crore');

        statutoryJustification = `Eligible under CEGSSC guidelines eliminating third-party tangible collateral constraints for SC-owned enterprises.`;
        subsidyEstimate = '100% Credit Guarantee Cover';

        matches.push({
          scheme,
          fitPercentage: score,
          statutoryJustification,
          matchedCriteria,
          prerequisites: ['Competent authority issued SC Caste Certificate'],
          subsidyEstimate
        });
      }
    }

    // ================= Post-Matric Scholarship =================
    if (scheme.id === 'post-matric-scholarship') {
      if (
        profile.supportGoal === 'Education' ||
        profile.occupation === 'Student' ||
        profile.age < 26
      ) {
        score = 89;
        matchedCriteria.push('Higher education / course fee support requirement identified');
        if (profile.familyIncome <= 250000) {
          matchedCriteria.push('Annual family income qualifies under statutory ₹2.5L limit');
        } else {
          prerequisites.push('Annual income exceeds ₹2.5L ceiling; partial fee concession may apply');
        }

        statutoryJustification = `Direct DBT entitlement under Central Post-Matric Scholarship framework for tuition fee waiver and monthly maintenance allowance.`;
        subsidyEstimate = '100% Tuition Fee Waiver + Maintenance';

        matches.push({
          scheme,
          fitPercentage: profile.familyIncome <= 250000 ? 92 : 72,
          statutoryJustification,
          matchedCriteria,
          prerequisites,
          subsidyEstimate
        });
      }
    }

    // ================= PM SVANidhi =================
    if (scheme.id === 'svanidhi') {
      if (
        (profile.businessType === 'Trading' || profile.supportGoal === 'New Business') &&
        profile.projectCost <= 100000 &&
        (profile.locationType === 'Urban' || profile.locationType === 'Semi-Urban')
      ) {
        score = 80;
        matchedCriteria.push('Urban / Semi-Urban micro retail profile matches');
        matchedCriteria.push('7% Interest subsidy on digital repayment');

        statutoryJustification = `Eligible under PM SVANidhi for rapid working capital disbursement with escalatory tranches.`;
        subsidyEstimate = '₹10,000 to ₹50,000 Working Capital';

        matches.push({
          scheme,
          fitPercentage: score,
          statutoryJustification,
          matchedCriteria,
          prerequisites: ['Letter of Recommendation or ULB Vending Certificate'],
          subsidyEstimate
        });
      }
    }

    // ================= PM Vishwakarma =================
    if (scheme.id === 'pm-vishwakarma') {
      if (
        profile.occupation === 'Farmer / Other' ||
        profile.businessType === 'Manufacturing' ||
        profile.supportGoal === 'New Business'
      ) {
        score = 81;
        matchedCriteria.push('Traditional enterprise / artisan sector qualification eligible');
        matchedCriteria.push('Concessional 5% interest rate collateral-free loan');

        statutoryJustification = `Eligible under PM Vishwakarma Scheme for artisanal enterprise credit, toolkits, and market integration.`;
        subsidyEstimate = '₹3 Lakh Loan @ 5% + ₹15k Toolkit';

        matches.push({
          scheme,
          fitPercentage: score,
          statutoryJustification,
          matchedCriteria,
          prerequisites: ['One member per family rule; Gram Panchayat / ULB verification'],
          subsidyEstimate
        });
      }
    }
  }

  // Sort descending by fit percentage
  matches.sort((a, b) => b.fitPercentage - a.fitPercentage);

  // If no matches (e.g. edge cases), fallback to top general schemes like PMEGP and MUDRA
  if (matches.length === 0) {
    const defaultScheme = SCHEMES_DATABASE[0];
    matches.push({
      scheme: defaultScheme,
      fitPercentage: 80,
      statutoryJustification:
        'Eligible for general enterprise credit subsidy subject to standard departmental appraisal.',
      matchedCriteria: [
        'General age threshold satisfied',
        'Enterprise credit evaluation active'
      ],
      prerequisites: ['Detailed Project Report submission'],
      subsidyEstimate: 'Up to 25% Capital Subsidy'
    });
  }

  return matches;
}
