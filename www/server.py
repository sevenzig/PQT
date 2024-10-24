import http.server
import socketserver
import os

PORT = 8000

class DebugHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[Request] {self.path}")
        print(f"[Current Dir] {os.getcwd()}")
        print(f"[File Exists] {os.path.exists('.' + self.path)}")
        super().log_message(format, *args)

with socketserver.TCPServer(("", PORT), DebugHTTPRequestHandler) as httpd:
    print(f"Serving at port {PORT}")
    print(f"Current directory: {os.getcwd()}")
    print("\nAvailable files:")
    for root, dirs, files in os.walk("."):
        level = root.replace(".", "").count(os.sep)
        indent = " " * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = " " * 4 * (level + 1)
        for f in files:
            print(f"{subindent}{f}")

    httpd.serve_forever()