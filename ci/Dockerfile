FROM alpine:latest

RUN apk update && \
    apk add python3 && \
    apk add py3-pip

RUN python3 -m pip install ansible
RUN python3 -m pip install requests
RUN python3 -m pip install docker
RUN python3 -m pip install docker-compose
RUN export PATH="$PATH:/root/.local/bin"