FROM gitpod/workspace-full:2022-04-11-18-21-27

# Copy .nvmrc files
COPY .nvmrc /tmp/.nvmrc

# Set environment variables
ENV NVM_DIR $HOME/nvm
RUN mkdir -p $NVM_DIR

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

SHELL ["/bin/bash", "--login", "-c"]
RUN source "$HOME/.nvm/nvm.sh" \
  && export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] \
  && . "$NVM_DIR/nvm.sh" \
  && VERSION="$(cat /tmp/.nvmrc)" \
  && nvm install "$VERSION" \
  && nvm use "$VERSION" \
  && npm install -g pnpm@latest

RUN pip install localstack awscli awscli-local

ENV EXTRA_CORS_ALLOWED_ORIGINS '*'
ENV DISABLE_CORS_CHECKS 1
ENV DISABLE_CUSTOM_CORS_APIGATEWAY 1

WORKDIR /workspace

COPY . .

USER root
RUN pnpm i --no-frozen-lockfile

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
