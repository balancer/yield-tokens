const url = 'https://backend-arbitrum.gains.trade/apr'


const query = `{
  'collateralRewards.{symbol == "USDC"}.vaultApr'
}`

const requestQuery = {
  query,
}

interface Response {
  data: {
    gUSDCApr: string
  }
}

export const gUSDC = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestQuery),
  })

  const {
    data: { gUSDCApr },
  } = (await response.json()) as Response

  const actualAPR = parseFloat(gUSDCApr)

  return {
    '0xd3443ee1e91af28e5fb858fbd0d72a63ba8046e0': Math.round(actualAPR),
  }
}