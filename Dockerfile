# Użyj odpowiedniej wersji Node.js
FROM node:18

# Katalog roboczy
WORKDIR /app

# Skopiuj zależności
COPY package*.json ./

# Instalacja zależności produkcyjnych i deweloperskich
RUN npm install

# Skopiuj cały kod źródłowy
COPY . .

# Wystaw port aplikacji (jeśli używasz Express)
EXPOSE 5000

# Domyślne polecenie
CMD ["node", "project.js"]