### Setting up a local Subgraph Environment

## Prquisites

The following packeges and tools have to be installed for the setup to be working:

### Docker

https://docs.docker.com/get-started/#download-and-install-docker

### IPFS

https://github.com/ipfs/ipfs-desktop/releases

### Graph CLI

```
# NPM
npm install -g @graphprotocol/graph-cli

# Yarn
yarn global add @graphprotocol/graph-cli
```

### Local Graph Node

Set up local Graph node with graph-cli.

In new Terminal navigate to the docker folder:

```
cd graph-node/docker
```

Then run:

```
./setup.sh
```

This adapts the local docker-compose file of the graph-node to link to the local chain, that we host with anvil.

```
docker-compose up
```

Starts the graph-node that should link up to the local chain automatically.

### Deploying Subgraph

In new Terminal navigate to the subgraph folder:

```
cd PCEDaoSubgraph
```

Create the subgraph via:

```
graph codegen && graph build
```

Register subgraph name in the graph-node:

```
npm run create-local
```

Deploy the subgraph to the local graph-node:

```
npm run deploy-local
```
