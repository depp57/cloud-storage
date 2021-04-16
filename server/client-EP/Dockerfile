FROM ubuntu

RUN mkdir /bin/cloud-storage

COPY ./run /bin/cloud-storage/

# /!\ Security failure : don't copy these files, they contain credentials.
# instead, mount volume for container in which container can read conf files.

# COPY ./server.conf.yaml /bin/cloud-storage/server.conf.yaml
# COPY ../db/mysql.conf.yaml /bin/cloud-storage/mysql.conf.yaml

ENTRYPOINT ["/bin/bash", "-c"]

# Must cd to cloud-storage dir before running the service
# confs files are mounted in /bin/cloud-storage/confs
CMD ["cd /bin/cloud-storage && ./run"]