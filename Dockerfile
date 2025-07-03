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
COPY . .
RUN npm run build

# ---------- Production Runtime Stage ----------
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
