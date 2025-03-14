import { Offer } from "@/types/offer";

import { getMetadata, truncateAddress } from "@/utils";
import { LockOpen, Lock } from "lucide-react";

export function OrderItem({ offer }: { offer: Offer }) {
  const metadataTokenA = getMetadata(offer.acctTokenMintA);
  const metadataTokenB = getMetadata(offer.acctTokenMintB);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-start flex-col gap-3">
        <div className="flex items-center flex-row gap-3">
          <div className="flex items-center gap-1">
            <span className="text-xl">{metadataTokenA.icon}</span>
            <span className="font-medium">
              {offer.tokenAOfferedAmount.toString()} {metadataTokenA.symbol}
            </span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-1">
            <span className="text-xl">{metadataTokenB.icon}</span>
            <span className="font-medium">
              {offer.tokenBWantedAmount.toString()} {metadataTokenB.symbol}
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Maker: {truncateAddress(offer.acctMaker)}
        </div>
      </div>

      <div className="text-sm flex flex-row items-center">
        <span
          className={`text-xs flex flex-row font-medium px-3 py-2 gap-2 items-center rounded-full ${
            offer.closed
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          }`}
        >
          {offer.closed ? <Lock /> : <LockOpen />}
          {offer.closed ? "Closed" : "Open"}
        </span>
      </div>
    </div>
  );
}
