FROM node:24-alpine
WORKDIR /NotesApp
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]