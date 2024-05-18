import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line no-unused-vars
const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const pricesResponse = await fetch('https://fd60qhijvtes7do71ou6moc14s.ingress.pcgameservers.com/api/prices')
  const guppyFuryPoolResponse = await fetch('https://furya.api.nodeshub.online/cosmwasm/wasm/v1/contract/furya14p3r422qp04p345mnqe5umjy3vqx75hpxf54f8enf59wf27fksvqltavjp/smart/eyJwb29sIjp7fX0=')
  if (!pricesResponse.ok) {
    throw new Error(`Failed to fetch prices: ${pricesResponse.status}`)
  }
  if (!guppyFuryPoolResponse.ok) {
    throw new Error(`Failed to fetch guppy fury pool: ${guppyFuryPoolResponse.status}`)
  }
  const guppyFuryPool = await guppyFuryPoolResponse.json()
  const [guppy, fury] = guppyFuryPool?.data?.assets || []
  const prices = (await pricesResponse.json()).data
  const furyPrice = prices['white-fury']?.usd ?? 0
  prices.guppy = { usd: Number(((Number(fury?.amount ?? 0)) / (Number(guppy?.amount ?? 0))) * (Number(furyPrice) ?? 0)).toFixed(10) }
  res.status(200).json({ data: prices })
}

export default handler
