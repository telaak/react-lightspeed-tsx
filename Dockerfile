FROM node:16-alpine as node
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
FROM nginx:alpine
COPY ng.conf /etc/nginx/conf.d/
COPY --from=node /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
CMD ["/bin/sh", "-c", "sed -i s#SED_WEBSOCKET_URL#$WEBSOCKET_URL#g /usr/share/nginx/html/static/js/main.*.js && nginx -g 'daemon off;'"]