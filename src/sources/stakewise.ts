const url =
  'https://mainnet-graph.stakewise.io/subgraphs/name/stakewise/stakewise'

const query = `
  {
    osTokens {
      apy
    }
  }
`

const requestQuery = {
  query,
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
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestQuery),
  })

  const {
    data: {
      osTokens: [{ apy }],
    },
  } = (await response.json()) as Response

  const apr = Math.round(Number(apy) * 100)

  return {
    '0xf1c9acdc66974dfb6decb12aa385b9cd01190e38': apr,
    '0xf7d4e7273e5015c96728a6b02f31c505ee184603': apr,
  }
}
