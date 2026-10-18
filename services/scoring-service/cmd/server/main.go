package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/reflection"
	"google.golang.org/grpc/status"
)

// ScoringServer mengimplementasikan logic evaluasi performa tinggi di Go
type ScoringServer struct{}

type CalculateRoleFitRequest struct {
	UserID             string   `json:"user_id"`
	TargetRoleID       string   `json:"target_role_id"`
	CandidateSkills    []string `json:"candidate_skills"`
	ParsedResumeSummary string  `json:"parsed_resume_summary"`
}

type SkillMatchDetail struct {
	SkillName       string  `json:"skill_name"`
	RequiredLevel   string  `json:"required_level"`
	Status          string  `json:"status"` // STRONG_MATCH, PARTIAL_MATCH, CRITICAL_GAP
	ConfidenceScore float64 `json:"confidence_score"`
}

type CalculateRoleFitResponse struct {
	OverallFitScore int32              `json:"overall_fit_score"`
	MatchedSkills   []SkillMatchDetail `json:"matched_skills"`
	CriticalGaps    []string           `json:"critical_gaps"`
	XaiExplanation  string             `json:"xai_explanation"`
	ComputedAtUnix  int64              `json:"computed_at_unix"`
}

// CalculateRoleFit mengolah kecocokan skill & resume dengan kecepatan sub-millisecond di Golang
func (s *ScoringServer) CalculateRoleFit(ctx context.Context, req *CalculateRoleFitRequest) (*CalculateRoleFitResponse, error) {
	if req.TargetRoleID == "" {
		return nil, status.Error(codes.InvalidArgument, "target_role_id wajib diisi")
	}

	// Normalisasi skill kandidat menggunakan hash set di Go untuk efisiensi O(1)
	candidateSet := make(map[string]bool)
	for _, sk := range req.CandidateSkills {
		candidateSet[strings.ToLower(strings.TrimSpace(sk))] = true
	}

	// Benchmark taksonomi role (contoh: Junior PM / Software Engineer)
	targetSkills := []struct {
		Name     string
		Level    string
		Critical bool
	}{
		{Name: "product analytics", Level: "INTERMEDIATE", Critical: true},
		{Name: "user research", Level: "BEGINNER", Critical: false},
		{Name: "scrum & agile", Level: "INTERMEDIATE", Critical: true},
		{Name: "wireframing", Level: "BEGINNER", Critical: false},
	}

	var matched []SkillMatchDetail
	var gaps []string
	matchedCount := 0

	for _, ts := range targetSkills {
		if candidateSet[strings.ToLower(ts.Name)] {
			matchedCount++
			matched = append(matched, SkillMatchDetail{
				SkillName:       ts.Name,
				RequiredLevel:   ts.Level,
				Status:          "STRONG_MATCH",
				ConfidenceScore: 0.95,
			})
		} else {
			if ts.Critical {
				gaps = append(gaps, ts.Name)
			}
			matched = append(matched, SkillMatchDetail{
				SkillName:       ts.Name,
				RequiredLevel:   ts.Level,
				Status:          "CRITICAL_GAP",
				ConfidenceScore: 0.20,
			})
		}
	}

	fitScore := int32((float64(matchedCount) / float64(len(targetSkills))) * 100)
	if fitScore < 40 && len(req.CandidateSkills) > 0 {
		fitScore = 55 // Baseline penyesuaian transferrable skills
	}

	explanation := fmt.Sprintf(
		"Evaluasi Go Engine: Terdeteksi %d dari %d kompetensi inti untuk role '%s'. Ditemukan %d kesenjangan kritis (%s).",
		matchedCount, len(targetSkills), req.TargetRoleID, len(gaps), strings.Join(gaps, ", "),
	)

	return &CalculateRoleFitResponse{
		OverallFitScore: fitScore,
		MatchedSkills:   matched,
		CriticalGaps:    gaps,
		XaiExplanation:  explanation,
		ComputedAtUnix:  time.Now().Unix(),
	}, nil
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "50051"
	}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatalf("Gagal membuka port tcp %s: %v", port, err)
	}

	// Inisialisasi gRPC Server dengan best practices gRPC-Go
	grpcServer := grpc.NewServer()

	// Enable gRPC Server Reflection untuk debugging (misal: grpcurl / Postman)
	reflection.Register(grpcServer)

	log.Printf("🚀 CareerStudent AI - Go gRPC Scoring Microservice listening on :%s\n", port)

	// Graceful shutdown
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
		<-sigChan
		log.Println("🛑 Menerima sinyal terminasi, mematikan server gRPC secara graceful...")
		grpcServer.GracefulStop()
		log.Println("✅ Server gRPC berhasil dihentikan.")
	}()

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Server gRPC berhenti dengan error: %v", err)
	}
}
