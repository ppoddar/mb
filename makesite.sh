#/bin/sh
# --------------------------------------------------------------
# Copies the entire Mahabharata website to AWS EC2 by rsync
# Requires
#  digital-artisar.cer
#  exclude-rsync.txt
# --------------------------------------------------------------
REMOTE_USER=ec2-user
#REMOTE_HOST=54.193.158.233
REMOTE_HOST=mahabharatha.in
REMOTE_PORT=8000
#REMOTE_HOST=digital-artisan.org
#PEM_FILE=digital-artisan.pem
PEM_FILE=mb.pem
# -------------------------------------------
# rsyncs all web assets to aws EC2 machine
# -------------------------------------------
# A  trailing slash on the source changes this behavior to avoid creating
# an additional directory level at the destination
SOURCE=./
# Note also that host and module  references  don't  require  a  trailing
# slash to copy the contents of the default directory.
REMOTE_DEST=/home/ec2-user/mb
#REMOTE_DEST=/var/www/html

sudo rsync -avz --omit-dir-times \
      -e "ssh -i $PEM_FILE" \
      --exclude-from=exclude-rsync.txt \
      $SOURCE $REMOTE_USER@$REMOTE_HOST:$REMOTE_DEST

#open https://$REMOTE_HOST:$REMOTE_PORT
