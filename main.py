#!/usr/bin/env python3
"""Simple static server to serve the ASCII webcam app.

Usage:
  python main.py         # serve ./web on http://localhost:8000 and open browser
  python main.py -p 9000 # serve on a different port
  python main.py --no-browser # don't open the browser automatically
"""
import http.server
import socketserver
import webbrowser
import argparse
import os
import sys

DEFAULT_PORT = 8000
DEFAULT_DIR = "web"

class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def run(port=DEFAULT_PORT, directory=DEFAULT_DIR, no_browser=False):
    if not os.path.isdir(directory):
        print(f"Error: directory '{directory}' doesn't exist.")
        sys.exit(1)

    os.chdir(directory)
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        url = f"http://localhost:{port}/index.html"
        print(f"Serving '{directory}' at {url}")
        if not no_browser:
            try:
                webbrowser.open(url)
            except Exception as e:
                print("Could not open browser automatically:", e)
                print("Open this URL manually:", url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-p','--port',type=int,default=DEFAULT_PORT,help='Port to serve on')
    parser.add_argument('-d','--dir',default=DEFAULT_DIR,help='Directory to serve')
    parser.add_argument('--no-browser',action='store_true',help="Don't open a browser automatically")
    args = parser.parse_args()
    run(port=args.port, directory=args.dir, no_browser=args.no_browser)
