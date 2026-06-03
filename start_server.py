import http.server
import ssl

# Port 4443 is common for testing; 443 requires root/admin privileges
server_address = ('localhost', 8000)

# Initialize the basic HTTP server
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

# Python 3.13 recommended: Create a server-side SSL context
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
# Update this line in your script
context.load_cert_chain(certfile='localhost.crt', keyfile='localhost.key')

# Wrap the server socket
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"Server started at https://{server_address[0]}:{server_address[1]}")
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\nShutting down server.")
    httpd.server_close()
