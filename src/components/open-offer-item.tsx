import { Button } from "@/components/ui/button";
import { Offer } from "@/types/offer";
import { getMetadata } from "@/utils";

interface OfferItemProps {
  offer: Offer;
  onTakeOffer: () => void;
}

export function OfferItem({ offer, onTakeOffer }: OfferItemProps) {
  const metadataTokenA = getMetadata(offer.acctTokenMintA);
  const metadataTokenB = getMetadata(offer.acctTokenMintB);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
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
      <Button onClick={onTakeOffer} size="sm">
        Take Offer
      </Button>
    </div>
  );
}
