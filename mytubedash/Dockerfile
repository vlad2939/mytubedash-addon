# Ne folosim de o "fundație" foarte ușoară de Linux care are deja Node.js pus
FROM node:20-alpine

# Setăm folderul curent de lucru intern din Home Assistant
WORKDIR /app

# Copiem fișierele de organizare
COPY package*.json ./

# AICI se dă npm install! (o va face Home Assistant la el acasă, nu tu)
RUN npm install

# Copiem tot codul din folderul tău
COPY . .

# Compilăm aplicația pentru o afișare ultra-rapidă (SPA)
RUN npm run build

# Instalăm rapid un server static ("serve") pentru a arăta pagina spre exterior
RUN npm install -g serve

# Deschidem portul 3000
EXPOSE 3000

# Ce comandă se dă efectiv când iei "Start" la Add-on
CMD ["serve", "-s", "dist/app/browser", "-l", "3000"]