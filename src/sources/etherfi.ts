const url = 'https://api.studio.thegraph.com/proxy/41778/syko-dev-mainnet/v0.0.3'

const query = `
  {
    rebaseEventLinkedLists {
      latest_aprs
    }
  }
`

const requestQuery = {
  query
}

interface Response {
  data: {
    rebaseEventLinkedLists: {
      latest_aprs: string[]
    }[]
  }
}

export const etherfi = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestQuery)
  })

  const {
    data: { rebaseEventLinkedLists: [{ latest_aprs }] },
  } = await response.json() as Response

  const avgApr = latest_aprs.map(apr => Number(apr)).reduce((acc, apr) => acc + apr, 0) / latest_aprs.length;

  return {
    '0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee': Math.round(avgApr),
    '0x346e03f8cce9fe01dcb3d0da3e9d00dc2c0e08f0': Math.round(avgApr),
    '0x35751007a407ca6feffe80b3cb397736d2cf4dbe': Math.round(avgApr),
  }
}
