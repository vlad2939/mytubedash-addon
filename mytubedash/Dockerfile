# Ne folosim de o fundatie foarte usoara de Linux care are deja Node.js pus
FROM node:20-alpine

# Setam folderul curent de lucru intern din Home Assistant
WORKDIR /app

# Copiem fisierele de organizare
COPY package*.json ./

# AICI se da npm install! (o va face Home Assistant la el acasa, nu tu)
RUN npm install

# Copiem tot codul din folderul tau
COPY . .

# Compilam aplicatia pentru o afisare ultra-rapida (SPA)
RUN npm run build -- --configuration production

# Instalam rapid un server static ("serve") pentru a arata pagina spre exterior
RUN npm install -g serve

# Deschidem portul 3000
EXPOSE 3000

# Ce comanda se da efectiv cand dai "Start" la Add-on
CMD ["serve", "-s", "dist/app/browser", "-l", "3000"]
