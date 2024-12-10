from http.server import HTTPServer, BaseHTTPRequestHandler
import ssl


httpd = HTTPServer(('localhost', 443), BaseHTTPRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket, 
        keyfile="/etc/apache2/ssl/localhost.key", 
        certfile='/etc/apache2/ssl/localhost.cer', server_side=True)

httpd.serve_forever()