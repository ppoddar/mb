openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 \
  -nodes -keyout mahabharatha.in.key -out mahabharatha.in.crt -subj "/CN=mahabharatha.in" \
  -addext "subjectAltName=DNS:mahabharatha.in"
