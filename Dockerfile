FROM node:16 as build-stage
## dirty... but not sure how to solve ssl problems inside docker without it.
ENV NODE_TLS_REJECT_UNAUTHORIZED=0 
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

## now on to stage 1.
FROM nginx
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

