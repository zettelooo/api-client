const baseDomain = 'api.zettel.ooo'

export const apiConfig = {
  baseUrls: {
    rest: `https://${baseDomain}`,
    ws: `wss://${baseDomain}`,
  },
} as const
