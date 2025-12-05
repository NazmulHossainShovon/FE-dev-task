FROM node:20.17.0-alpine as build

ARG VITE_BACKEND_URL
ARG VITE_COMMIT_SHA

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_COMMIT_SHA=$VITE_COMMIT_SHA

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Optional: cache busting for backend URL changes
RUN echo $VITE_BACKEND_URL > .backend_url

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# Vite outputs to dist by default
COPY --from=build /app/dist /usr/share/nginx/html

# If you have a custom nginx.conf, copy it; otherwise, skip this line
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
