FROM golang:1.17 AS builder
RUN mkdir /src
WORKDIR /src
COPY clientEndpoint clientEndpoint
COPY common common
COPY go.mod go.mod
COPY go.sum go.sum
RUN go build -o clientEndpoint/clientEP clientEndpoint/main.go

FROM ubuntu:latest
COPY --from=builder /src/clientEndpoint/clientEP /cloud-storage/bin/
RUN mkdir /cloud-storage/conf
ENTRYPOINT ["/cloud-storage/bin/clientEP"]
EXPOSE 8008