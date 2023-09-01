import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { abi } from "./abis/bloom-bps-feed";

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://rpc.ankr.com/eth'),
})

const tokens = {
  tbyFeb1924: {
    address: '0x7966c5bae631294d7cffcea5430b78c2f76db6fa', 
    feedAddress: '0xde1f5f2d69339171d679fb84e4562febb71f36e6'
  },
}
export const bloom = async () => {
  try {
    const res = await client.multicall({
      contracts: [{
        address: tokens.tbyFeb1924.feedAddress as `0x${string}`,
        abi,
        functionName: 'currentRate',
      }]
    })
    const currentRate = res[0].result
    const apr = (Number(currentRate) - 10000)
    return { [tokens.tbyFeb1924.address]: apr }
  } catch (error) {
    console.log(error)
    return {}
  }
}