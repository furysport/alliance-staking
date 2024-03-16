import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line no-unused-vars
const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch('https://fd60qhijvtes7do71ou6moc14s.ingress.pcgameservers.com/api/prices')
  res.status(200).json(await response.json())
}

export default handler
