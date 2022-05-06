mkdir $HOME/.ssh || true
cd $HOME/.ssh

# generate key-pair and adding it to authorized_keys
ssh-keygen -t rsa -b 2048 -N "" -f id_rsa
cat id_rsa.pub >> authorized_keys

## TODO collect priv key ##
## TODO swap sshd config file ##

sudo systemctl restart sshd