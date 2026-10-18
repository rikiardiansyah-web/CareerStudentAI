# CareerStudent AI - Go gRPC Scoring & Matchmaking Microservice

Service berkinerja tinggi yang menangani komputasi taksonomi skill, kecocokan role (Role Fit Matchmaking), dan penilaian interview real-time.

## Arsitektur & Standar Industri
Sesuai panduan standar **gRPC Golang (gRPC-Go)**:
- **Kontrak Protobuf v3**: Didefinisikan di `services/proto/careerstudent/v1/scoring.proto` dengan versioning semantik (`careerstudent.v1`).
- **Tooling Linter**: Terstandarisasi menggunakan `buf.yaml` (Buf toolchain).
- **Graceful Shutdown**: Menggunakan channel `os.Signal` (`SIGTERM` & `SIGINT`) dengan `grpcServer.GracefulStop()`.
- **Server Reflection**: Terintegrasi untuk kemudahan debugging dan inspeksi via grpcurl atau Postman.

## Struktur Direktori
```
services/
├── proto/
│   ├── buf.yaml
│   └── careerstudent/
│       └── v1/
│           └── scoring.proto
└── scoring-service/
    ├── go.mod
    └── cmd/
        └── server/
            └── main.go
```

## Menjalankan Service (Development / Docker)
```bash
cd services/scoring-service
go run cmd/server/main.go
```
Port default: `50051`.
