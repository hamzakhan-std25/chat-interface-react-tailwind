FROM node:18-alpine
WORKDIR /usr/src/app

# 1. Use capital 'Backend' to match your folder name
COPY Backend/package*.json ./

RUN npm install --production

# 2. Use capital 'Backend' here too
COPY Backend/ .

# Security for Hugging Face
RUN chown -R 1000:1000 /usr/src/app
USER 1000

# App must listen on 7860
EXPOSE 7860
ENV PORT=7860

# 3. Based on your file list, your entry point is server.js
CMD ["node", "server.js"]
