# FROM gitpod/workspace-full:2022-04-11-18-21-27

# # Copy .nvmrc and package.json files
# COPY .nvmrc /tmp/.nvmrc
# COPY package.json /tmp/package.json

# # Switch to root user temporarily to set permissions
# USER root

# # Set write permissions for gitpod user
# RUN chown -R gitpod:gitpod /workspace

# # Install Node.js and PNPM
# SHELL ["/bin/bash", "--login", "-c"]
# RUN source ~/.nvm/nvm.sh && \
#     export NVM_DIR="$HOME/.nvm" && \
#     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
#     export VERSION=$(cat /tmp/.nvmrc) && \
#     nvm install $VERSION && \
#     nvm use $VERSION && \
#     npm install -g pnpm

# # Set up the workspace
# RUN mkdir -p /home/gitpod/.npm-global/bin \
#   && echo 'export PATH="/home/gitpod/.npm-global/bin:$PATH"' >> /home/gitpod/.bashrc

# ENV PATH="/home/gitpod/.npm-global/bin:${PATH}"

# # Set up the project
# WORKDIR /workspace

# # Copy your project files
# COPY . .

# # Install project dependencies as root user
# USER root
# RUN pnpm install

# # Change ownership back to gitpod user
# RUN chown -R gitpod:gitpod /workspace

# # Add a HEALTHCHECK instruction
# HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
#   CMD curl -f http://localhost/ || exit 1


FROM gitpod/workspace-full:2022-04-11-18-21-27

# Copy .nvmrc and package.json files
COPY .nvmrc /tmp/.nvmrc
COPY package.json /tmp/package.json

# Set environment variables
ENV NVM_DIR $HOME/nvm
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Switch to non-root user 'gitpod'
USER gitpod

# Install Node.js and PNPM
SHELL ["/bin/bash", "--login", "-c"]
RUN source ~/.nvm/nvm.sh && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    export VERSION=$(cat /tmp/.nvmrc) && \
    nvm install $VERSION && \
    nvm use $VERSION && \
    npm install -g pnpm

# Set up the workspace
RUN mkdir -p /home/gitpod/.npm-global/bin \
  && echo 'export PATH="/home/gitpod/.npm-global/bin:$PATH"' >> /home/gitpod/.bashrc

ENV PATH="/home/gitpod/.npm-global/bin:${PATH}"

# Set up the project
WORKDIR /workspace

# Copy your project files
COPY . .

# Install project dependencies as root user
USER root
RUN pnpm install

# Add a HEALTHCHECK instruction
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
