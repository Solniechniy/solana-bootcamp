import { getMint } from "@solana/spl-token";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";

export const useMetadataLoading = (tokenAddress: string) => {
  const { connection } = useConnection();
  const { data: metadata } = useQuery({
    queryKey: ["metadata"],
    queryFn: async () => {
      const metadata = await getMint(
        connection,
        new PublicKey(tokenAddress),
        "confirmed",
        TOKEN_PROGRAM_ID
      );
      return metadata.decimals;
    },
  });
  return metadata;
};
