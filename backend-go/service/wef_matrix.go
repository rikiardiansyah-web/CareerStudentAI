package service

import (
	"strings"
)

// WEFSkillCategory defines the category of skills from the WEF 2023 report
type WEFSkillCategory string

const (
	CognitiveThinking WEFSkillCategory = "Cognitive & Analytical Thinking"
	Technological     WEFSkillCategory = "Technology & Data Literacy"
	SelfEfficacy      WEFSkillCategory = "Resilience, Flexibility & Agility"
	WorkingWithOthers WEFSkillCategory = "Leadership & Social Influence"
)

// SkillItem represents an individual skill benchmark
type SkillItem struct {
	Name      string           `json:"name"`
	Category  WEFSkillCategory `json:"category"`
	Benchmark int              `json:"benchmark"`
}

// Global WEF 2023 Top 10 Core Skills Taxonomy Reference
var StandardWEFSkills = []SkillItem{
	{Name: "Analytical Thinking", Category: CognitiveThinking, Benchmark: 90},
	{Name: "Creative Thinking", Category: CognitiveThinking, Benchmark: 85},
	{Name: "AI and Big Data", Category: Technological, Benchmark: 85},
	{Name: "Leadership and Social Influence", Category: WorkingWithOthers, Benchmark: 80},
	{Name: "Resilience, Flexibility and Agility", Category: SelfEfficacy, Benchmark: 85},
	{Name: "Curiosity and Lifelong Learning", Category: SelfEfficacy, Benchmark: 80},
	{Name: "Technological Literacy", Category: Technological, Benchmark: 85},
	{Name: "Design and User Experience", Category: CognitiveThinking, Benchmark: 75},
	{Name: "Motivation and Self-Awareness", Category: SelfEfficacy, Benchmark: 80},
	{Name: "Empathy and Active Listening", Category: WorkingWithOthers, Benchmark: 75},
}

// SkillGapSummary holds the computed gap analysis
type SkillGapSummary struct {
	OverallReadiness int         `json:"overall_readiness"`
	Strengths        []SkillItem `json:"strengths"`
	Gaps             []SkillItem `json:"gaps"`
	SummaryAdvice    string      `json:"summary_advice"`
}

// ComputeWEFGap calculates the user's readiness score against WEF 2023 taxonomy
func ComputeWEFGap(userSkills []string) SkillGapSummary {
	userSkillMap := make(map[string]bool)
	for _, s := range userSkills {
		userSkillMap[strings.ToLower(strings.TrimSpace(s))] = true
	}

	strengths := make([]SkillItem, 0)
	gaps := make([]SkillItem, 0)

	for _, item := range StandardWEFSkills {
		matched := false
		for us := range userSkillMap {
			if strings.Contains(us, strings.ToLower(item.Name)) || strings.Contains(strings.ToLower(item.Name), us) {
				matched = true
				break
			}
		}

		if matched {
			strengths = append(strengths, item)
		} else {
			gaps = append(gaps, item)
		}
	}

	readiness := int((float64(len(strengths)) / float64(len(StandardWEFSkills))) * 100)
	advice := "Kandidat perlu memperkuat aspek literasi data dan penalaran analitis sesuai standar WEF 2023."
	if readiness >= 70 {
		advice = "Kandidat memiliki keselarasan profil kompetensi yang sangat kuat dengan kebutuhan pasar kerja global."
	}

	return SkillGapSummary{
		OverallReadiness: readiness,
		Strengths:        strengths,
		Gaps:             gaps,
		SummaryAdvice:    advice,
	}
}
