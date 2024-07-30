// src/types/apiTypes.ts

// Define a type for the response from /api/getCollectedBadges
export type CollectedBadgesResponse = {
    collected: {
      m: number;
      t: number;
      w: number;
      th: number;
      f: number;
      s: number;
      su: number;
    };
  };
  
  // Define a type for the response from /api/collect
  export type CollectResponse = {
    collected: boolean;
  };
  