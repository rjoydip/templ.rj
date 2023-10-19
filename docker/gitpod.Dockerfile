FROM gitpod/workspace-full

COPY .nvmrc /tmp/.nvmrc

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

SHELL ["/bin/bash", "--login", "-c"]
RUN source "$HOME/.nvm/nvm.sh" \
  && export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] \
  && . "$NVM_DIR/nvm.sh" \
  && nvm install "$(cat /tmp/.nvmrc)" \
  && nvm use "$(cat /tmp/.nvmrc)" \
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
