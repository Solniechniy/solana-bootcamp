import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CreateOfferDialog } from "@/components/create-offer-dialog";
import { OfferItem } from "@/components/offer-item";
import { PaginationControl } from "@/components/pagination-control";
import { Offer } from "@/types/offer";

interface OffersPageProps {
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  paginatedOffers: Offer[] | undefined;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  isWalletConnected,
  connectWallet,
  paginatedOffers = [],
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Offers</CardTitle>
        <CardDescription>
          View all orders that have been created on the platform.
        </CardDescription>
        <CreateOfferDialog
          isWalletConnected={isWalletConnected}
          onConnectWallet={connectWallet}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paginatedOffers?.map((offer) => (
            <OfferItem key={offer.id} offer={offer} />
          ))}

          {paginatedOffers?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </CardFooter>
    </Card>
  );
};
