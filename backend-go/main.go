package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rikiardiansyah-web/CareerStudentAI/backend-go/service"
)

// Request payloads
type ATSPayload struct {
	ResumeText       string   `json:"resume_text"`
	RequiredKeywords []string `json:"required_keywords"`
}

type SkillGapPayload struct {
	Discipline string   `json:"discipline"`
	UserSkills []string `json:"user_skills"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "50051"
	}

	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "healthy",
			"service": "CareerStudent AI High-Performance Microservice Engine (Go)",
			"version": "1.0.0",
		})
	})

	// Sub-millisecond ATS scoring engine
	mux.HandleFunc("/api/v1/evaluate-ats", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
		var payload ATSPayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		res := service.EvaluateATS(payload.ResumeText, payload.RequiredKeywords)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	})

	// Sub-millisecond WEF 2023 Skill-Gap Matrix computation
	mux.HandleFunc("/api/v1/compute-skill-gap", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
		var payload SkillGapPayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		res := service.ComputeWEFGap(payload.UserSkills)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	})

	fmt.Printf("[CareerStudent AI] Golang Engine Service running on port :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
