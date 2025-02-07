FROM node:23.3.0

WORKDIR /dao-subgraph

# Copy the package.json file
COPY . .

# Install dependencies
RUN yarn install

RUN yarn codegen && yarn build

COPY <<EOF /dao-subgraph/run.sh
#!/bin/bash
sleep 30
yarn create-local & 
wait
yarn deploy-local
wait
EOF

RUN chmod +x /dao-subgraph/run.sh

CMD ["sh", "-c", "/dao-subgraph/run.sh"]