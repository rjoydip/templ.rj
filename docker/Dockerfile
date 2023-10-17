FROM alpine:latest

LABEL rjoydip.image.authors="Joydip Roy (rjoydip)"

ENV EXTRA_CORS_ALLOWED_ORIGINS '*'
ENV DISABLE_CORS_CHECKS 1
ENV DISABLE_CUSTOM_CORS_APIGATEWAY 1
ENV PYTHONUNBUFFERED=1

USER root

RUN addgroup -g 33333 gitpod \
  && mkdir /etc/sudoers.d \
  && echo '%gitpod ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/gitpod \
  && adduser -u 33333 -G gitpod -h /home/gitpod -s /bin/bash -D gitpod \
  && mkdir /workspace && chown -hR gitpod:gitpod /workspace

WORKDIR /workspace/templ

RUN apk --no-cache add -U curl bash ca-certificates openssl ncurses coreutils python3 make gcc g++ iptables gcompat libstdc++ libgcc libgcc linux-headers grep util-linux binutils findutils nodejs npm python3 py3-pip

RUN pip3 install --no-cache --upgrade pip setuptools \
  && npm install -g pnpm@latest
# psutil pyproject-toml localstack awscli awscli-local

COPY . .
RUN pnpm i --no-frozen-lockfile

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

USER gitpod
