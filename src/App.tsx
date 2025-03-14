import React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@solana/wallet-adapter-react-ui/styles.css";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { config } from "@/solana-service/config";
import { Connection, PublicKey } from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import { EscrowProgram } from "@/solana-service/program";
import { Wallet } from "@coral-xyz/anchor";
import { OffersPage } from "@/pages/all-offers";
import { OpenOffersPage } from "@/pages/open-offers";
import AccountOffers from "@/pages/account-offers";
import { Offer } from "@/types/offer";

import { Toaster } from "sonner";
import { getMetadata, query } from "./utils";

const App: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const wallet = useAnchorWallet();

  const { data } = useQuery({
    queryKey: ["offers"],
    async queryFn() {
      return await request<{ offers: Offer[] | undefined }>(
        config.subgraphUrl,
        query
      );
    },
  });
  console.log("walletAddress", walletAddress);

  const [currentPage, setCurrentPage] = useState({
    orders: 1,
    openOffers: 1,
    accountOffers: 1,
  });

  const { connect, connected, publicKey, disconnect } = useWallet();

  const ITEMS_PER_PAGE = 5;

  const paginatedOffers = data?.offers?.slice(
    (currentPage.orders - 1) * ITEMS_PER_PAGE,
    currentPage.orders * ITEMS_PER_PAGE
  );

  const paginatedOpenOffers = (data?.offers ?? [])
    .filter((el) => !el.closed)
    ?.slice(
      (currentPage.openOffers - 1) * ITEMS_PER_PAGE,
      currentPage.openOffers * ITEMS_PER_PAGE
    );

  const paginatedAccountOffers = data?.offers;

  const totalPages = {
    orders: Math.ceil((data?.offers?.length ?? 1) / ITEMS_PER_PAGE),
    openOffers: Math.ceil((data?.offers?.length ?? 1) / ITEMS_PER_PAGE),
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      console.log("here wallet");
      setIsWalletConnected(true);
      await connect();
    } catch (e) {
      toast.error("Error connecting to wallet");
    }
  };

  const takeOffer = async (offer: Offer) => {
    if (!isWalletConnected) {
      return;
    }

    setSelectedOffer(offer);
  };

  const onTakeOffer = async () => {
    const connection = new Connection(
      clusterApiUrl(WalletAdapterNetwork.Devnet)
    );
    if (!wallet || !selectedOffer) return;

    const contract = new EscrowProgram(connection, wallet as Wallet);
    await contract.takeOffer(
      new PublicKey(selectedOffer?.acctMaker),
      new PublicKey(selectedOffer?.acctOffer),
      new PublicKey(selectedOffer?.acctTokenMintA),
      new PublicKey(selectedOffer?.acctTokenMintB)
    );
  };

  const handlePageChange = (tab: string, page: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [tab]: page,
    }));
  };

  useEffect(() => {
    if (connected && publicKey) {
      setIsWalletConnected(true);
      setWalletAddress(publicKey.toString());
    }
  }, [connected, publicKey]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-bold text-center mb-8">
          Solana Offers Management
        </h1>
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">All Offers</TabsTrigger>
            <TabsTrigger value="openOffers">Open Offers</TabsTrigger>
            <TabsTrigger value="accountOffers">Account Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OffersPage
              isWalletConnected={isWalletConnected}
              connectWallet={connectWallet}
              paginatedOffers={paginatedOffers}
              currentPage={currentPage.orders}
              totalPages={totalPages.orders}
              onPageChange={(page) => handlePageChange("orders", page)}
            />
          </TabsContent>

          <TabsContent value="openOffers">
            <OpenOffersPage
              paginatedOpenOffers={paginatedOpenOffers}
              currentPage={currentPage.openOffers}
              totalPages={totalPages.openOffers}
              onPageChange={(page) => handlePageChange("openOffers", page)}
              onTakeOffer={takeOffer}
            />
          </TabsContent>

          <TabsContent value="accountOffers">
            <AccountOffers
              isWalletConnected={isWalletConnected}
              disconnect={disconnect}
              setIsWalletConnected={setIsWalletConnected}
              paginatedAccountOffers={paginatedAccountOffers}
              loading={loading}
            />
          </TabsContent>

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
                      } ${
                        getMetadata(selectedOffer?.acctTokenMintA).symbol
                      } for ${selectedOffer?.tokenBWantedAmount} ${
                        getMetadata(selectedOffer?.acctTokenMintB).symbol
                      }.`}
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
                  <Button
                    onClick={onTakeOffer}
                    disabled={loading}
                    className="w-full"
                  >
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
        </Tabs>
      </div>
      <Toaster />
    </main>
  );
};

export default App;
