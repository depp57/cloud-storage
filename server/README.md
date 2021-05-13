## services 

communicates via ?
- custom protocol over tcp
- rabbitMQ

# client-EP

exposes REST-Api to manipulate 
- users
- directories/files stored

put user's files or files' artifacts in a *buffer bucket* so disk-manager can fetch them

# disk-dns

Register each disk server (adressed by their ip) on the cluster

# disk-manager

Permits a disk server to plug-in to the cluster

- fetch files from bucket and write them on *cloud-storage filesystem* + write virtual user's filesystem in *database*
- serve files on a buffer bucket to be transmits to the user trough client-EP