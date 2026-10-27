# CareerStudent AI - High-Performance Microservice Engine (Golang)

Layanan microservice komputasi performa tinggi yang dirancang untuk mendukung **CareerStudent AI** dalam melakukan pemrosesan data bervolume tinggi dengan latensi sub-milidetik:

1. **ATS Evaluation Engine**: Melakukan tokenisasi, pencocokan kata kunci industri, dan scoring dokumen resume secara instan.
2. **WEF 2023 Skill-Gap Matrix**: Mengkalkulasi disparitas kompetensi kandidat terhadap taksonomi 10 keterampilan masa depan World Economic Forum (WEF) 2023.
3. **Protobuf & gRPC Standard Contract**: Memungkinkan integrasi berkecepatan tinggi dengan backend Next.js API Routes / Gateway.

---

### Struktur Direktori

```text
backend-go/
├── go.mod                     # Module definition
├── main.go                    # Microservice entrypoint & HTTP/REST gateway
├── proto/
│   └── engine.proto           # Protobuf v3 contract specification for gRPC
└── service/
    ├── ats_engine.go          # Algoritma evaluasi ATS & keyword density
    └── wef_matrix.go          # Algoritma matriks kesenjangan skill WEF 2023
```

---

### Menjalankan Layanan (Development & Production)

```bash
# Masuk ke direktori
cd backend-go

# Menjalankan service
go run main.go
```
Port default: `:50051`.
Endpoint diagnostik: `GET /health`
