#!/bin/bash
# Pornește site-ul + CMS-ul local pe http://localhost:8000 (macOS / Linux)
# Necesită PHP. Pe Mac: brew install php
# Dublu-click pe acest fișier sau rulează: ./start-local.command

cd "$(dirname "$0")"

echo ""
echo "  Matteo Lungu - server local"
echo "  Site:  http://localhost:8000"
echo "  Admin: http://localhost:8000/admin/   (parola: matteo2026)"
echo ""
echo "  Apasa Ctrl+C ca sa opresti serverul."
echo ""

php -c php.dev.ini -S localhost:8000
