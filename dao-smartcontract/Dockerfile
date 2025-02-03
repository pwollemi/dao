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
WORKDIR /dao-smartcontract
COPY . .

RUN forge install

RUN forge compile --via-ir

CMD ["sh", "-c", "anvil --host 0.0.0.0 & sleep 5 && forge script src/script/script.s.sol:script --fork-url http://127.0.0.1:8545 --broadcast --via-ir && tail -f /dev/null"]
