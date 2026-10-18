// =============================================================================
// Career Matcher — Explainable AI Matching Engine
// Formula kecocokan transparan, bukan black-box AI score
// =============================================================================

import {
  CareerOpportunity,
  careerOpportunities,
} from "@/data/careerOpportunities";

export interface MatchResult {
  opportunity: CareerOpportunity;
  matchPercentage: number;
  matchedSkills: string[];
  partialSkills: string[];
  missingSkills: string[];
  formulaExplanation: string;
}

/**
 * Mencocokkan peluang karier dengan skill pengguna dari resume/profil
 * Formula: (fullMatches × 1.0 + partialMatches × 0.5) / totalRequired × 100
 *
 * @param userSkills - Daftar skill yang dimiliki pengguna (dari resume parse atau self-assessment)
 * @param targetRoleId - Opsional: filter hanya role tertentu dari taxonomy
 * @returns Array MatchResult yang di-sort dari kecocokan tertinggi
 */
export function matchCareerOpportunities(
  userSkills: string[],
  targetRoleId?: string
): MatchResult[] {
  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());

  let opportunities = careerOpportunities;

  // Filter by linked role if specified
  if (targetRoleId) {
    opportunities = opportunities.filter(
      (opp) => opp.linkedSkillGapRoleId === targetRoleId
    );
  }

  const results: MatchResult[] = opportunities.map((opp) => {
    const matchedSkills: string[] = [];
    const partialSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const skill of opp.requiredSkills) {
      const normalizedSkill = skill.toLowerCase();

      // Full match: exact atau substring match
      const isFullMatch = normalizedUserSkills.some(
        (us) =>
          us === normalizedSkill ||
          us.includes(normalizedSkill) ||
          normalizedSkill.includes(us)
      );

      if (isFullMatch) {
        matchedSkills.push(skill);
        continue;
      }

      // Partial match: check kata-kata individual
      const skillWords = normalizedSkill.split(/[\s\/\-]+/);
      const hasPartialOverlap = skillWords.some((word) =>
        word.length > 2
          ? normalizedUserSkills.some((us) => us.includes(word))
          : false
      );

      if (hasPartialOverlap) {
        partialSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    const totalRequired = opp.requiredSkills.length;
    const matchScore =
      totalRequired > 0
        ? ((matchedSkills.length * 1.0 + partialSkills.length * 0.5) /
            totalRequired) *
          100
        : 0;

    const matchPercentage = Math.round(Math.min(100, matchScore));

    return {
      opportunity: opp,
      matchPercentage,
      matchedSkills,
      partialSkills,
      missingSkills,
      formulaExplanation: `(${matchedSkills.length} skill cocok × 1.0 + ${partialSkills.length} skill parsial × 0.5) ÷ ${totalRequired} skill wajib × 100 = ${matchPercentage}%`,
    };
  });

  // Sort by match percentage descending
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
