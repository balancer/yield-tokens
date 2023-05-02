import { aave } from './sources/aave'
import { ankr } from './sources/ankr';
import { idle } from './sources/idle';
import { tranchess } from './sources/tranchess';
import { gearbox } from './sources/gearbox';
import { overnight } from './sources/overnight';
import { reaper } from './sources/reaper';
import { tessera } from './sources/tessera';
import { tetu } from './sources/tetu';
// import { euler } from './sources/euler';
import { defaultFetch } from './sources/default';

export interface Env {
  YIELD_TOKENS: KVNamespace;
}

const tokens = [
  { name: 'idleDai',   fetchFn: () => idle('0x0c80f31b840c6564e6c5e18f386fad96b63514ca') },
  { name: 'idleUsdc',  fetchFn: () => idle('0xc3da79e0de523eef7ac1e4ca9abfe3aac9973133') },
  { name: 'idleUsdt',  fetchFn: () => idle('0x544897a3b944fdeb1f94a0ed973ea31a80ae18e1') },
  { name: 'qETH',      fetchFn: tranchess },
  { name: 'gearbox',   fetchFn: gearbox },
  { name: 'overnight', fetchFn: overnight },
  { name: 'aaveV2Mainnet', fetchFn: () => aave(1) },
  { name: 'aaveV2Polygon', fetchFn: () => aave(137) },
  { name: 'aaveV3Mainnet', fetchFn: () => aave(1, 'v3') },
  { name: 'aaveV3Polygon', fetchFn: () => aave(137, 'v3') },
  { name: 'aaveV3Arbitrum', fetchFn: () => aave(42161, 'v3') },
  { name: 'ankr',    fetchFn: ankr },
  { name: 'reaper',  fetchFn: reaper },
  { name: 'tessera', fetchFn: tessera },
  { name: 'tetu',    fetchFn: tetu },
  { name: 'stEth',   fetchFn: () => defaultFetch({ tokens: ['0xae7ab96520de3a18e5e111b5eaab095312d7fe84', '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0', '0x03b54a6e9a984069379fae1a4fc4dbae93b3bccd', '0x5979d7b546e38e414f7e9822514be443a4800529'], url: 'https://eth-api.lido.fi/v1/protocol/steth/apr/sma', path: 'data.smaApr' }) },
  { name: 'stMatic', fetchFn: () => defaultFetch({ tokens: ['0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4'], url: 'https://polygon.lido.fi/api/stats', path: 'apr' }) },
  { name: 'cbEth',   fetchFn: () => defaultFetch({ tokens: ['0xbe9895146f7af43049ca1c1ae358b0541ea49704'], url: 'https://api.exchange.coinbase.com/wrapped-assets/CBETH/', path: 'apy', scale: 10000 }) },
  { name: 'rETH',    fetchFn: () => defaultFetch({ tokens: ['0xae78736cd615f374d3085123a210448e74fc6393', '0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8'], url: 'https://api.rocketpool.net/api/apr', path: 'yearlyAPR' }) },
  { name: 'sfrxETH', fetchFn: () => defaultFetch({ tokens: ['0xac3e018457b222d93114458476f3e3416abbe38f'], url: 'https://api.frax.finance/v2/frxeth/summary/latest', path: 'sfrxethApr' }) },
  { name: 'stafi',   fetchFn: () => defaultFetch({ tokens: ['0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593'], url: 'https://drop-api.stafi.io/reth/v1/poolData', path: 'data.stakeApr' }) },
  { name: 'usdr',    fetchFn: () => defaultFetch({ tokens: ['0xaf0d9d65fc54de245cda37af3d18cbec860a4d4b'], url: 'http://usdr-api.us-east-1.elasticbeanstalk.com/usdr/apy', path: 'usdr' }) },
  { name: 'maticX',  fetchFn: () => defaultFetch({ tokens: ['0xfa68fb4628dff1028cfec22b4162fccd0d45efb6'], url: 'https://universe.staderlabs.com/polygon/apy', path: 'value' }) },
  // Had to proxy this one because Binance API was blocking requests from Cloudflare, original URL: https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/rewardRateList?projectId=BETH
  { name: 'wbETH',   fetchFn: () => defaultFetch({ tokens: ['0xa2e3356610840701bdf5611a53974510ae27e2e1'], url: 'https://faas-ams3-2a2df116.doserverless.co/api/v1/web/fn-683e4669-de62-4f89-9609-2e24ba8acfa7/default/binance', path: 'data.0.rewardRate' }) },
  // { name: 'euler',     fetchFn: euler },
]

const names = tokens.map((t) => t.name)

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Check if the request has a path
    const url = new URL(request.url)
    const path = url.pathname.slice(1)

    if (path && names.includes(path)) {
      const token = tokens.find((t) => t.name === path)
      if (token) {
        const aprs = await token.fetchFn()
        if (aprs) {
          ctx.waitUntil(storeAprs(env.YIELD_TOKENS, aprs))
          return new Response(JSON.stringify(aprs), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Allow CORS
            },
          })
        }
      }
      // } else if (path == 'all') {
      //   const json = await fetchAndStoreAll(env.YIELD_TOKENS)
      //   return new Response(JSON.stringify(json), {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Cache-Control': `s-maxage=600`, // Cache for 10 minutes
      //       'Access-Control-Allow-Origin': '*', // Allow CORS
      //     },
      //   })
      // }
      return new Response('Not found', {
        status: 404,
      })
    }

    const json = await env.YIELD_TOKENS.get('all', 'text')
    return new Response(json, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `s-maxage=600`, // Cache for 10 minutes
        'Access-Control-Allow-Origin': '*', // Allow CORS
      },
    })
  },

  // Scheduled events are run every 10 minutes
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(fetchAndStoreAll(env.YIELD_TOKENS))
  },
};

// Fetch APRs for all tokens and store them in KV
const fetchAndStoreAll = async (store: KVNamespace) => {
  const responses = await Promise.all(
    tokens.map(({ fetchFn }) => fetchFn())
  )
  const aprs = responses.reduce((acc, val) => ({ ...acc, ...val }), {})
  if (Object.keys(aprs).length > 0) {
    await storeAprs(store, aprs)
  }
  return aprs
}

// Fetch APRs for a single token and store them in KV
const fetchAndStore = async (store: KVNamespace) => {
  const next = Number(await store.get('next'))
  const token = tokens[next]
  const aprs = await token.fetchFn()
  if (aprs) {
    await storeAprs(store, aprs)
  }
  return await store.put('next', String((next + 1) % tokens.length))
}

// Store APRs in KV only if they have changed, to avoid unnecessary writes
// KV is limited to 1k writes per day
const storeAprs = async (store: KVNamespace, aprs: { [key: string]: number }) => {
  const all = await store.get('all', 'json') as { [key: string]: number }

  let changes = false
  Object.keys(aprs).forEach((key) => {
    if (all[key] !== aprs[key]) changes = true
    all[key] = aprs[key]
  })

  if (changes) {
    await store.put('all', JSON.stringify(all))
  }
}
