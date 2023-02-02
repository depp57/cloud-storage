cd $REPO_PATH/server/ops/ansible
ansible-playbook build-and-deploy.yml \
    -i inventory.yaml \
    --extra-vars "repo_root_path=$REPO_PATH mysql_username=$MYSQL_USERNAME mysql_password=$MYSQL_PASSWORD disk_name=disk-01 trigger_action=build" \
    --limit localhost