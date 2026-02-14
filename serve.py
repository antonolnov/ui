#!/usr/bin/env python3
"""
Simple HTTP server for ATS WorkHere
Run this script and open http://localhost:8000 in your browser
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000

# Change to the directory containing this script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🚀 ATS WorkHere is running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    
    # Try to open browser automatically
    try:
        webbrowser.open(f"http://localhost:{PORT}")
    except:
        pass
    
    httpd.serve_forever()
