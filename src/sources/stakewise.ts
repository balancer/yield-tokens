import { appFetch } from '../fetch'

const urls = {
  mainnet:
    'https://mainnet-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
  gnosis:
    'https://gnosis-graph.stakewise.io/subgraphs/name/stakewise/stakewise',
}

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
  const aprs: Record<string, number> = {}
  for (const network in urls) {
    const response = await appFetch(urls[network as keyof typeof urls], {
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
    aprs[network] = apr
  }

  return {
    '0xf1c9acdc66974dfb6decb12aa385b9cd01190e38': aprs['mainnet'],
    '0xf7d4e7273e5015c96728a6b02f31c505ee184603': aprs['mainnet'],
    '0xf490c80aae5f2616d3e3bda2483e30c4cb21d1a0': aprs['gnosis'],
  }
}
