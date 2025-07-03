# ---------- Base Stage ----------
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# ---------- Development Stage ----------
FROM base AS development
COPY . .
EXPOSE 8080
CMD ["npm", "run", "serve"]

# ---------- Production Build Stage ----------
FROM base AS build

# Copy semua source code untuk build
COPY . .

# Pastikan ENV file tersedia (jika perlu VUE_APP_*)
# ARG NODE_ENV=production
# ENV NODE_ENV=$NODE_ENV

# Jalankan build production
RUN npm run build

# ---------- Production Runtime Stage ----------
FROM nginx:alpine AS production

# Salin hasil build dari stage sebelumnya
COPY --from=build /app/dist /usr/share/nginx/html

# Konfigurasi nginx opsional (gzip, caching, dst)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]