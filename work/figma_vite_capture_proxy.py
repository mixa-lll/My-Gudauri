from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.request import Request, urlopen

UPSTREAM = 'http://127.0.0.1:5174'
SCRIPT = '<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>'


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            request = Request(UPSTREAM + self.path, headers={'Accept-Encoding': 'identity'})
            with urlopen(request) as response:
                body = response.read()
                content_type = response.headers.get('Content-Type', '')
                if 'text/html' in content_type:
                    body = body.decode('utf-8').replace('</head>', SCRIPT + '</head>').encode('utf-8')
                self.send_response(response.status)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
        except Exception as error:
            self.send_error(502, str(error))


HTTPServer(('127.0.0.1', 5175), Handler).serve_forever()
