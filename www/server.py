from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"Request: {self.path}")
        sys.stdout.flush()

port = 3000
print(f"Starting server on http://localhost:{port}")
print(f"Press Ctrl+C to stop")
sys.stdout.flush()

HTTPServer(('localhost', port), Handler).serve_forever()