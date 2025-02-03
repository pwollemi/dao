import { sepolia } from 'wagmi/chains'
import { localhost } from '~/app/providers'

export const pceAddress = {
  [sepolia.id]: '0x000e6DBbB00b0B6921557Be1D4Bb9b67715aEf40',
  [localhost.id]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
} as Record<number, `0x${string}`>

export const pceCommunity = {
  [sepolia.id]: '0x4C49aDFad2E9bc865d22B970F325d056909763Cf',
  [localhost.id]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
} as Record<number, `0x${string}`>

export const timelockAddress = {
  [sepolia.id]: '0x79BA635335212D67f68F717821e4d6dE971D2eFD',
  [localhost.id]: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
} as Record<number, `0x${string}`>

export const governorAddress = {
  [sepolia.id]: '0x53056457ced3a389e85bb15184101e5799aD4d14',
  [localhost.id]: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
} as Record<number, `0x${string}`>

export const bountyAddress = {
  [sepolia.id]: '0xeF0062597e81011Ac8f5d5b686946cF5401E1bF4',
  [localhost.id]: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
} as Record<number, `0x${string}`>

export const factoryAddress = {
  [sepolia.id]: '0x90af8F49a768F6f32F233586aD6b581a16861fA9',
  [localhost.id]: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
} as Record<number, `0x${string}`>

export const daoStudioAddress = {
  [sepolia.id]: '0x524a549FFb543980645251A9dde8b0BDBf429B15',
  [localhost.id]: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
} as Record<number, `0x${string}`>

export const SUBGRAPH_URL = {
  [sepolia.id]:
    'https://api.studio.thegraph.com/query/81073/dao_dashboard/version/latest',
  [localhost.id]: 'http://localhost:8000/subgraphs/name/dao_dashboard',
} as Record<number, string>
