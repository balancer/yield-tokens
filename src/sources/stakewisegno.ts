const url =
  'https://gnosis-graph.stakewise.io/subgraphs/name/stakewise/stakewise'

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

export const stakewisegno = async () => {
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
    '0xf490c80aae5f2616d3e3bda2483e30c4cb21d1a0': apr,
  }
}