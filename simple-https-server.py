from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl


httpd = HTTPServer(('localhost', 443), SimpleHTTPRequestHandler)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain(certfile='./ssl/localhost.crt', keyfile="./ssl/localhost.key")
httpd.socket = ctx.wrap_socket (httpd.socket, server_side=True)

httpd.serve_forever()