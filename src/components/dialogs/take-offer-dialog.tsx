import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { getMetadata } from "@/utils";
import { Offer } from "@/types/offer";

export default function TakeOfferDialog({
  selectedOffer,
  setSelectedOffer,
  isWalletConnected,
  connectWallet,
  onTakeOffer,
  loading,
}: {
  selectedOffer: Offer | null;
  setSelectedOffer: (offer: Offer | null) => void;
  isWalletConnected: boolean;
  connectWallet: () => void;
  onTakeOffer: () => void;
  loading: boolean;
}) {
  return (
    <Dialog
      open={selectedOffer !== null}
      onOpenChange={(open) => !open && setSelectedOffer(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Take Offer</DialogTitle>
          <DialogDescription>
            {!isWalletConnected
              ? "Connect your wallet to take this offer."
              : `You're about to exchange ${
                  selectedOffer?.tokenAOfferedAmount
                } ${getMetadata(selectedOffer?.acctTokenMintA).symbol} for ${
                  selectedOffer?.tokenBWantedAmount
                } ${getMetadata(selectedOffer?.acctTokenMintB).symbol}.`}
          </DialogDescription>
        </DialogHeader>

        {selectedOffer && (
          <div className="py-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {getMetadata(selectedOffer?.acctTokenMintA).icon}
                </div>
                <div className="font-medium">
                  {selectedOffer.tokenAOfferedAmount.toString()}{" "}
                  {getMetadata(selectedOffer?.acctTokenMintA).symbol}
                </div>
              </div>
              <div className="text-xl">→</div>
              <div className="text-center">
                <div className="text-2xl mb-1">
                  {getMetadata(selectedOffer?.acctTokenMintB).icon}
                </div>
                <div className="font-medium">
                  {selectedOffer.tokenBWantedAmount.toString()}{" "}
                  {getMetadata(selectedOffer?.acctTokenMintB).symbol}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!isWalletConnected ? (
            <Button
              onClick={connectWallet}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          ) : (
            <Button onClick={onTakeOffer} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Transaction"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
