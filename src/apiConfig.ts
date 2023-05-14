export const apiConfig = {
  baseUrlsByTargetEnvironment: {
    local: {
      rest: 'http://localhost:3001',
      ws: 'ws://localhost:3001',
    },
    stage: {
      rest: 'https://api-stage.zettel.ooo',
      ws: 'wss://api-stage.zettel.ooo',
    },
    live: {
      rest: 'https://api.zettel.ooo',
      ws: 'wss://api.zettel.ooo',
    },
  },
} as const
