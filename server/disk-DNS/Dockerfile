FROM ubuntu

RUN mkdir /bin/cloud-storage

COPY ./main /bin/cloud-storage/

ENTRYPOINT ["/bin/bash", "-c"]

CMD ["/bin/cloud-storage/main"]