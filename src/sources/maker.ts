import { abi } from './abis/maker-pot'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://rpc.ankr.com/eth'),
})

const potAddress = '0x197e90f9fad81970ba7976f33cbd77088e5d7cf7'
const sDAI = '0x83f20f44975d03b1b09e64809b757c47f942beea'
const sDAIBase = '0x99ac4484e8a1dbd6a185380b3a811913ac884d87'
const sDAIOP = '0x2218a117083f5b482b0bb821d27056ba9c04b1d3'
const sDAIFraxtal = '0x09eadcbaa812a4c076c3a6cde765dC4a22e0d775'

export const maker = async () => {
  try {
    const res = await client.multicall({
      contracts: [
        {
          address: potAddress,
          abi,
          functionName: 'dsr',
        },
      ],
    })
    const dsr = res[0].result
    const apr = Math.round(
      (Number(dsr) * 10 ** -27 - 1) * 365 * 24 * 60 * 60 * 10000,
    )
    return { [sDAI]: apr, [sDAIBase]: apr, [sDAIOP]: apr, [sDAIFraxtal]: apr }
  } catch (error) {
    console.log(error)
    return {}
  }
}
