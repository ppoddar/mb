#!/bin/sh
REMOTE_USER=ec2-user
#REMOTE_HOST=54.193.158.233
REMOTE_HOST=mahabharatha.in
PEM_FILE=digital-artisan.pem
ssh -i $PEM_FILE $REMOTE_USER@$REMOTE_HOST
