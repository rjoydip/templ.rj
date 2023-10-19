FROM alpine:latest

LABEL rjoydip.image.authors="Joydip Roy (rjoydip)"

ENV EXTRA_CORS_ALLOWED_ORIGINS '*'
ENV DISABLE_CORS_CHECKS 1
ENV DISABLE_CUSTOM_CORS_APIGATEWAY 1
ENV PYTHONUNBUFFERED=1

COPY .nvmrc /tmp/.nvmrc

RUN apk --no-cache update && \
  apk --no-cache add bash curl && \
  python3.8 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.9/main
# ca-certificates openssl ncurses coreutils make gcc g++ iptables gcompat libstdc++ libgcc libgcc libffi-dev  linux-headers grep util-linux binutils findutils

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash; \
  echo 'source $HOME/.profile;' >> "$HOME"/.zshrc; \
  echo 'export NVM_NODEJS_ORG_MIRROR=https://unofficial-builds.nodejs.org/download/release;' >>"$HOME"E/.profile; \
  echo 'nvm_get_arch() { nvm_echo "x64-musl"; }' >> "$HOME"/.profile; \
  NVM_DIR="$HOME/.nvm"; source "$HOME"/.nvm/nvm.sh; source "$HOME"/.profile; \
  nvm install "$(cat /tmp/.nvmrc)" && npm install -g pnpm@latest

RUN apk --no-cache update && \
  apk --no-cache add bash && \
  apk --no-cache add openjdk8-jre && \
  apk --no-cache add python python-dev libstdc++ openssl-dev linux-headers libffi-dev clang make g++ gcc curl groff less && \
  python3 -m ensurepip && \
  rm -r /usr/lib/python*/ensurepip && \
  pip3 --no-cache-dir install --upgrade pip wheel && \
  pip3 --no-cache-dir install -U setuptools && \
  pip3 --no-cache-dir install psutil awscli urllib3 python-coveralls cfn-lint==0.20.0 && \
  rm -rf /var/cache/apk/*

RUN pip3 --no-cache-dir install localstack awscli awscli-local

WORKDIR /workspace/templ

COPY . .

RUN pnpm i --no-frozen-lockfile

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# USER gitpod
