FROM node:23.3.0

# Install foundry dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Foundry
RUN curl -L https://foundry.paradigm.xyz | bash && \
    /root/.foundry/bin/foundryup

# Add Foundry binaries to the PATH
ENV PATH="/root/.foundry/bin:${PATH}"

RUN foundryup

COPY ./core /core
COPY ./.env /core/.env
COPY ./Upgrade.s.sol /core/script/Upgrade.s.sol

WORKDIR /core
RUN bash -c '. .env'

RUN npm install -g @openzeppelin/upgrades-core@1.34.4
RUN forge clean && forge build

CMD ["sh", "-c", "anvil --host 0.0.0.0 & sleep 1 && forge script script/Deploy.s.sol:Deploy --fork-url http://127.0.0.1:8545 --broadcast && sleep 5 && forge script script/Upgrade.s.sol:Upgrade --fork-url http://127.0.0.1:8545 --broadcast && tail -f /dev/null"]