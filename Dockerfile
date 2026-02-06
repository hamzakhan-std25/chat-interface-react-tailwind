# 1. Use the official Node.js image
FROM node:18-alpine

# 2. Create and set the working directory
WORKDIR /usr/src/app

# 3. Copy package files FROM the backend folder
COPY backend/package*.json ./

# 4. Install dependencies
RUN npm install --production

# 5. Copy the rest of the backend code
# This copies everything inside your 'backend' folder into the container
COPY backend/ .

# 6. Hugging Face Security: Set permissions for user 1000
RUN chown -R 1000:1000 /usr/src/app
USER 1000

# 7. Expose the mandatory Hugging Face port
EXPOSE 7860

# 8. Start the application
# Ensure your package.json 'start' script points to the correct entry file
ENV PORT=7860
CMD ["npm", "start"]
