FROM ubuntu

RUN mkdir /bin/cloud-storage

COPY ./run /bin/cloud-storage/
COPY ./server.conf.yaml /bin/cloud-storage/server.conf.yaml
COPY ../db/mysql.conf.yaml /bin/cloud-storage/mysql.conf.yaml

ENTRYPOINT ["/bin/bash", "-c"]

CMD ["/bin/cloud-storage/run"]