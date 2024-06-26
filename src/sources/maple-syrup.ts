const url = 'https://api.maple.finance/v2/graphql'

const query = `{
  syrupApy
}`

const requestQuery = {
  query,
}

interface Response {
  data: {
    syrupApy: string
  }
}

export const mapleSyrup = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestQuery),
  })

  const {
    data: { syrupApy },
  } = (await response.json()) as Response

  const actualAPR = parseFloat(syrupApy) / 1e26

  return {
    '0x80ac24aa929eaf5013f6436cda2a7ba190f5cc0b': Math.round(actualAPR),
  }
}
