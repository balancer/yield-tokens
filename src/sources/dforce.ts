import { abi } from './abis/dforce-susx'
import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'

// Initialize the client for Arbitrum network
const client = createPublicClient({
  chain: arbitrum,
  transport: http('https://arb1.arbitrum.io/rpc'),
})

// Function to get the APY using the specified calculation
const getApy = async () => {
  try {
    const contract = {
      address: '0xbC404429558292eE2D769E57d57D6E74bbd2792d', // Contract address
      abi,
      functionName: 'currentAPY', // Function to call
      args: [3], // Function arguments if any
    }

    // Perform the call
    const result = await client.call(contract)
    const [apyRaw, startTime, endTime] = result

    // Calculate the APY based on the provided formula
    const apy = (Number(apyRaw) / 1e27 - 1) * 100

    return {
      apy: apy.toFixed(2), // Convert to a percentage string with 2 decimal places
      startTime: new Date(startTime * 1000), // Convert to JavaScript Date object
      endTime: new Date(endTime * 1000), // Convert to JavaScript Date object
    }
  } catch (error) {
    console.error('Error fetching APY:', error)
    return {
      apy: null,
      startTime: null,
      endTime: null,
    } // Return default values in case of error
  }
}

// Main function to be called
export const dfroce = async () => {
  return await getApy()
}
