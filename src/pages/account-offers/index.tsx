import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";

import { ExternalLink, Loader2 } from "lucide-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMetadata, truncateAddress } from "@/utils";
import { Button } from "@/components/ui/button";
import { Offer } from "@/types/offer";

function AccountOfferItem({ offer }: { offer: Offer }) {
  const metadataTokenA = getMetadata(offer.acctTokenMintA);
  const metadataTokenB = getMetadata(offer.acctTokenMintB);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg mb-2">
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
      <div className="flex flex-col items-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`https://explorer.solana.com/tx/${offer.trxHashOffer}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                {truncateAddress(offer.trxHashOffer)}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>View transaction on Solana Explorer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-xs text-muted-foreground">
          {offer.closed ? "Closed" : "Open"}
        </span>
      </div>
    </div>
  );
}

export default function AccountOffers({
  isWalletConnected,
  disconnect,
  setIsWalletConnected,
  paginatedAccountOffers,
  loading,
}: {
  isWalletConnected: boolean;
  disconnect: () => void;
  setIsWalletConnected: (isWalletConnected: boolean) => void;
  paginatedAccountOffers?: Offer[];
  loading: boolean;
}) {
  return (
    <TabsContent value="accountOffers">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Your Offers</CardTitle>
            <CardDescription>View your open and closed offers.</CardDescription>
          </div>
          {isWalletConnected ? (
            <div>
              <Button
                onClick={() => {
                  try {
                    disconnect();
                    setIsWalletConnected(false);
                  } catch (e) {
                    console.log("Error disconnecting", e);
                  }
                }}
              >
                Disconnect
              </Button>
            </div>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isWalletConnected ? (
              <div className="text-center py-8">
                <p className="mb-4 text-muted-foreground">
                  Connect your wallet to view your offers
                </p>
                <WalletMultiButton style={{ backgroundColor: "black" }}>
                  <Button asChild disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <div>Connect Wallet</div>
                    )}
                  </Button>
                </WalletMultiButton>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Open Offers</h3>
                  {paginatedAccountOffers
                    ?.filter((o) => !o.closed)
                    .map((offer) => (
                      <AccountOfferItem key={offer.id} offer={offer} />
                    ))}

                  {paginatedAccountOffers?.filter((o) => !o.closed).length ===
                    0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No open offers
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Closed Offers</h3>
                  {paginatedAccountOffers
                    ?.filter((o) => o.closed)
                    .map((offer) => (
                      <AccountOfferItem key={offer.id} offer={offer} />
                    ))}
                  {paginatedAccountOffers?.filter((o) => o.closed).length ===
                    0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No closed offers
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
