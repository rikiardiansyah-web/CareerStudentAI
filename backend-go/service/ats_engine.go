package service

import (
	"strings"
)

// ATSResult holds calculation results for ATS parsing
type ATSResult struct {
	Score           int      `json:"score"`
	Compliant       bool     `json:"compliant"`
	MatchedKeywords []string `json:"matched_keywords"`
	MissingKeywords []string `json:"missing_keywords"`
	Recommendations string   `json:"recommendations"`
}

// EvaluateATS parses raw resume text against required target industry keywords
func EvaluateATS(resumeText string, requiredKeywords []string) ATSResult {
	normalizedResume := strings.ToLower(resumeText)
	matched := make([]string, 0)
	missing := make([]string, 0)

	for _, kw := range requiredKeywords {
		cleanKw := strings.ToLower(strings.TrimSpace(kw))
		if cleanKw == "" {
			continue
		}
		if strings.Contains(normalizedResume, cleanKw) {
			matched = append(matched, kw)
		} else {
			missing = append(missing, kw)
		}
	}

	total := len(requiredKeywords)
	if total == 0 {
		return ATSResult{
			Score:           100,
			Compliant:       true,
			MatchedKeywords: matched,
			MissingKeywords: missing,
			Recommendations: "Format resume memenuhi standar dasar ATS.",
		}
	}

	ratio := float64(len(matched)) / float64(total)
	score := int(ratio * 100)
	compliant := score >= 70

	rec := "Tingkatkan kata kunci teknis pada poin pengalaman kerja."
	if compliant {
		rec = "Resume memiliki keterbacaan ATS sangat tinggi dengan distribusi kata kunci yang seimbang."
	}

	return ATSResult{
		Score:           score,
		Compliant:       compliant,
		MatchedKeywords: matched,
		MissingKeywords: missing,
		Recommendations: rec,
	}
}
