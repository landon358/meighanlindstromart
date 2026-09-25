#!/usr/bin/env python3
"""
Dev server for the Meighan Lindstrom site.

python -m http.server sends no Cache-Control at all, only Last-Modified.
Browsers then cache heuristically and will quietly reuse an old main.js or
style.css without even revalidating — which looks exactly like "the change
didn't work". This refuses caching outright so a plain reload is always the
current build.

Usage:  python3 serve.py [port] [root]
"""

import functools
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        # Drop revalidation headers so we never answer 304 either.
        for h in ("If-Modified-Since", "If-None-Match"):
            if h in self.headers:
                del self.headers[h]
        return super().send_head()

    def log_message(self, fmt, *args):
        # Quieter: skip the 200s, keep anything that went wrong.
        msg = fmt % args
        if " 200 " in msg or " 304 " in msg:
            return
        sys.stderr.write("%s - %s\n" % (self.log_date_time_string(), msg))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4321
    root = sys.argv[2] if len(sys.argv) > 2 else "."
    handler = functools.partial(NoCacheHandler, directory=root)
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print("serving %s at http://localhost:%d  (caching disabled)" % (root, port))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
