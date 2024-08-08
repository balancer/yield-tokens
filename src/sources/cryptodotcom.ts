const url = 'https://api.crypto.com/pos/v1/public/get-staking-instruments'

// Define the request body with the country code
const requestQuery = {
  params: {
    country_code: 'POL',
  },
}

// Define the response interface to match the expected API response structure
interface Response {
  data: {
    cdcETHAPR: string
  }
}

export const cryptodotcom = async () => {
  // Perform the POST request
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestQuery), // Convert the request body to JSON
  })

  // Parse the JSON response
  const {
    data: { cdcETHAPR },
  } = (await response.json()) as Response

  // Calculate the actual APR
  const actualAPR = parseFloat(cdcETHAPR) / 1e26

  return {
    '0xfe18ae03741a5b84e39c295ac9c856ed7991c38e': Math.round(actualAPR),
  }
}
