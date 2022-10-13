docker run -it --name test-certbot -p 80:80 -v $HOME/certs:/etc/letsencrypt/archive ubuntu

RUN DEBIAN_FRONTEND=noninteractive TZ=Europe/Paris apt update && apt install certbot -y && apt install python3-certbot-apache -y
RUN certbot certonly -n --apache --domains iofactory.fr,www.iofactory.fr --email sven.thommet@gmail.com --agree-tos