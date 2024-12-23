import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tokenId = Array.isArray(req.query.tokenId) 
    ? req.query.tokenId[0] 
    : req.query.tokenId;

  if (!tokenId) {
    return res.status(400).json({ error: 'Token ID is required' });
  }

  const host = req.headers.host;
  if (!host) {
    return res.status(400).json({ error: 'Host header is required' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${host}`;

  const metadata = {
    name: "Gift Pack",
    description: "This NFT represents a dynamic gift bundle designed to hold multiple digital assets in one place. Owners can deposit various tokens or collectibles into the pack, transfer it to a recipient, and allow them to unwrap the contents at their convenience. It's a seamless way to share and receive digital assets!",
    image: `${baseUrl}/image/${tokenId}`,
    attributes: [
      {
        trait_type: "Type",
        value: "Gift Pack"
      },
      {
        trait_type: "Token ID",
        value: tokenId
      }
    ],
    animation_url: null,
    background_color: null,
  };

  // Set cache control headers
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=600'
  );

  return res.status(200).json(metadata);
} 