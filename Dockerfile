FROM node:18.16.0-alpine3.17 AS builder

WORKDIR /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY package*.json ./
COPY ./ .
RUN npm install
# RUN npm ci --production
RUN npm run build 
#ENTRYPOINT ["/entrypoint.sh"]
# USER node
# EXPOSE 80
# CMD ["npm", "run", "preview"]

FROM nginx:alpine3.17-slim

ADD nginx_conf/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist . /usr/share/nginx/html/

EXPOSE 80
