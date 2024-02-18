FROM gitpod/workspace-full:2022-04-11-18-21-27

# Copy .nvmrc files
COPY .nvmrc /tmp/.nvmrc

# Set environment variables
ENV NVM_DIR $HOME/nvm
RUN mkdir -p $NVM_DIR

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

SHELL ["/bin/bash", "--login", "-c"]
# Install Node.js and PNPM
RUN source "$HOME/.nvm/nvm.sh" \
  && export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] \
  && . "$NVM_DIR/nvm.sh" \
  && VERSION="$(cat /tmp/.nvmrc)" \
  && nvm install "$VERSION" \
  && nvm use "$VERSION" \
  && npm install -g pnpm@latest

# Set up the project
WORKDIR /workspace

# Copy your project files
COPY . .

# Install project dependencies as root user
USER root
RUN pnpm i --no-frozen-lockfile

# Add a HEALTHCHECK instruction
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
