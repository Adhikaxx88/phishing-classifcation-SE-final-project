FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5173

# Sesuaikan dengan script start di package.json lu (biasanya vite)
CMD ["npm", "run", "dev", "--", "--host"]