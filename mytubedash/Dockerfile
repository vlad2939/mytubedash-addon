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

# Deschidem portul 3000
EXPOSE 3000

# Ce comanda se da efectiv cand dai "Start" la Add-on
CMD ["node", "ha-server.js"]
