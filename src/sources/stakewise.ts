const url = 'https://mainnet-graph.stakewise.io/subgraphs/name/stakewise/stakewise'

const query = `
  {
    osTokens {
      apy
    }
  }
`

const requestQuery = {
  query
}

interface Response {
  data: {
    osTokens: {
      apy: string[]
    }[]
  }
}

export const stakewise = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestQuery)
  })

  const {
    data: { osTokens: [{ apy }] },
  } = await response.json() as Response

  return {
    '0xf1c9acdc66974dfb6decb12aa385b9cd01190e38': Math.round(Number(apy) * 100),
  }
}
