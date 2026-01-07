# Node LTS
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia package.json primeiro (cache)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto do projeto
COPY . .

# Porta que você pediu
EXPOSE 4700

# Sobe Angular na porta 4700 acessível fora do container
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4700"]
