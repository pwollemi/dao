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

WORKDIR /v1-core

COPY . .

RUN bash -c '. .env'

RUN rm -rf lib/openzeppelin-contracts-upgradeable && \
    rm -rf lib/openzeppelin-contracts && \
    rm -rf lib/forge-std && \
    rm -rf lib/openzeppelin-foundry-upgrades

RUN git init
RUN git submodule add -f https://github.com/OpenZeppelin/openzeppelin-contracts.git lib/openzeppelin-contracts
RUN git submodule add -f https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable.git lib/openzeppelin-contracts-upgradeable
RUN git submodule add -f https://github.com/foundry-rs/forge-std.git lib/forge-std
RUN git submodule add -f https://github.com/OpenZeppelin/openzeppelin-foundry-upgrades.git lib/openzeppelin-foundry-upgrades

RUN forge remappings > remappings.txt
RUN forge compile

CMD ["sh", "-c", "anvil --host 0.0.0.0 & sleep 5 && forge script script/Deploy.s.sol:Deploy --fork-url http://127.0.0.1:8545 --broadcast && tail -f /dev/null"]
