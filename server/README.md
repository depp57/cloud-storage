## services 

communicates via ?
- custom protocol over tcp
- rabbitMQ

# clientEndpoint

exposes REST-Api to users

proxifies files to be downloaded from disk-manager to users

put uploaded user's files on a *file buffer service* to be taken down from disk-manager when one is ready


# diskManager

Permits a disk server to plug-in to the cluster

- fetch files from buffer and write them on *cloud-storage filesystem*
- write virtual user's filesystem in *database*
