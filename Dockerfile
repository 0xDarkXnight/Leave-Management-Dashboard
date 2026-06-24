##############################################################################
#  Dockerfile — Leave Management Dashboard (Frontend)
#
#  Strategy: Multi-stage build
#
#  Stage 1 "builder"  — Node.js environment: installs dependencies and
#                        compiles the Vite app into a static bundle (/dist)
#  Stage 2 "production" — Nginx alpine: copies only the /dist folder and
#                          serves it. No Node.js, no source code, no devDeps
#                          in the final image → image stays tiny (~25 MB).
#
#  Why multi-stage?
#  A single-stage image that keeps Node.js would be ~400 MB.
#  Splitting stages means the final image ships nothing except what the
#  browser actually needs (HTML/CSS/JS files + a web server).
##############################################################################


# ══════════════════════════════════════════════════════════════════════════════
# STAGE 1 — Builder
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

# alpine = minimal Linux (~5 MB base). We pick Node 20 LTS for stability.

WORKDIR /app

# ── Dependency installation (with layer caching) ──────────────────────────────
# Copy ONLY the package manifest files first.
# Docker caches each instruction as a layer. If package.json and
# package-lock.json have not changed, Docker reuses the cached npm ci layer
# and skips the slow download step entirely.
# This is the most impactful caching optimisation in a JS Dockerfile.
COPY package.json package-lock.json ./

# npm ci = "clean install"
#   • Uses package-lock.json exactly (reproducible builds)
#   • Fails if lock file is out of sync (catches CI drift early)
#   • Faster than npm install because it skips dependency resolution
RUN npm ci --frozen-lockfile

# ── Build-time environment variables ─────────────────────────────────────────
# CRITICAL CONCEPT: Vite bakes VITE_* variables into the JavaScript bundle
# AT BUILD TIME. This means they cannot be changed at runtime by passing
# -e flags to docker run. They must be known when `npm run build` is called.
#
# We use Docker ARGs (build-time variables) → expose them as ENVs so
# the Vite build process can read them.
# Docker Compose (or --build-arg flags) can override any of these defaults.

ARG VITE_APP_NAME="Leave Management System"
ARG VITE_APP_VERSION="1.0.0"
ARG VITE_API_BASE_URL="http://localhost:3000/api"
ARG VITE_REQUEST_TIMEOUT="8000"
ARG VITE_ENABLE_MOCK_API="true"

ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_REQUEST_TIMEOUT=$VITE_REQUEST_TIMEOUT
ENV VITE_ENABLE_MOCK_API=$VITE_ENABLE_MOCK_API

# ── Copy source code and build ────────────────────────────────────────────────
# Copy source AFTER npm ci so that source edits don't invalidate
# the expensive node_modules cache layer.
COPY . .

# Produce the optimised static bundle into /app/dist
# Vite minifies JS/CSS, code-splits, and adds content hashes to filenames.
RUN npm run build


# ══════════════════════════════════════════════════════════════════════════════
# STAGE 2 — Production (final image)
# ══════════════════════════════════════════════════════════════════════════════
FROM nginx:1.27-alpine AS production

# nginx:alpine ships a minimal Nginx (~25 MB). We don't need Node at runtime —
# only a web server to hand the pre-built static files to browsers.

# Remove the default "Welcome to nginx" config so it doesn't conflict
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration (SPA routing, caching, gzip, security)
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy ONLY the compiled bundle from the builder stage.
# Everything else (node_modules, source code, .env) stays behind.
COPY --from=builder /app/dist /usr/share/nginx/html

# Document which port the container listens on (does not actually publish it;
# use -p or ports: in Compose to bind it to the host).
EXPOSE 80

# Run Nginx in the foreground so Docker can manage the process lifecycle.
# "daemon off" is mandatory in containers — Nginx normally forks a daemon
# process and exits the parent; Docker would then see PID 1 exit and stop
# the container immediately.
CMD ["nginx", "-g", "daemon off;"]
