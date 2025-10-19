FROM nginx:1.25-alpine

RUN apk add --no-cache --update \
    wget \
    openssl \
    && rm -rf /var/cache/apk/* \
    && addgroup -S nginx \
    && adduser -S nginx -G nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

RUN mkdir -p /var/cache/nginx /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx \
    && chmod -R 755 /var/cache/nginx /var/log/nginx

USER nginx

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
