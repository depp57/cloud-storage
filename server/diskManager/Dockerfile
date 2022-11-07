FROM golang:1.17 AS builder
RUN mkdir /src
WORKDIR /src
COPY . .
RUN go build -o diskManager/diskManager diskManager/main.go

FROM ubuntu:latest
COPY --from=builder /src/diskManager/diskManager /cloud-storage/bin/
RUN mkdir /cloud-storage/conf
ENTRYPOINT ["/cloud-storage/bin/diskManager"]