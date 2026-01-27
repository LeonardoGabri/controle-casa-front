# =========================
# 1️⃣ Build da aplicação
# =========================
FROM node:18-alpine AS build

WORKDIR /app

# Copia dependências primeiro (cache)
COPY package*.json ./

RUN npm install

# Copia o restante do código
COPY . .

# Build de produção
RUN npm run build -- --configuration production


# =========================
# 2️⃣ Servidor Nginx
# =========================
FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ⚠️ Atenção ao caminho do dist
# normalmente: dist/controle-front
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
