FROM node:20-alpine

WORKDIR /app

# Install native compilation toolchain for dependencies like better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy structural definitions
COPY package*.json ./

# Explicitly install all required framework dependencies
RUN npm install
RUN npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer

# Copy project source files
COPY . .

# Compile TypeScript code to production JavaScript
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]