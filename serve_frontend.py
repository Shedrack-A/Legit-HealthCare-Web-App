import http.server
import socketserver
import os

PORT = 3000
WEB_DIR = os.path.join(os.path.dirname(__file__), 'frontend/build')

os.chdir(WEB_DIR)

Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Serving frontend at http://localhost:{PORT}")
httpd.serve_forever()
