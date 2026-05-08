#!/bin/sh
set -e

# Inyecta las URLs del backend en /usr/share/nginx/html/env.js
# Esto permite cambiar las URLs sin reconstruir la imagen (esencial en Render).
TARGET_FILE=/usr/share/nginx/html/env.js

cat > "$TARGET_FILE" <<EOF
window.APP_ENV = {
  AUTH_API_URL: "${AUTH_API_URL:-http://localhost:4001}",
  PARQUEADERO_API_URL: "${PARQUEADERO_API_URL:-http://localhost:4002}"
};
EOF

echo "[frontend] env.js generado con:"
echo "  AUTH_API_URL=${AUTH_API_URL:-http://localhost:4001}"
echo "  PARQUEADERO_API_URL=${PARQUEADERO_API_URL:-http://localhost:4002}"

exec "$@"
