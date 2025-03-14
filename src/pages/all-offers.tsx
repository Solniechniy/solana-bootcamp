import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { CreateOrderDialog } from '@/components/create-order-dialog';
import { OrderItem } from '@/components/order-item';
import { PaginationControl } from '@/components/pagination-control';
import { Offer } from '@/types/offer';

interface OrdersPageProps {
    isWalletConnected: boolean;
    connectWallet: () => Promise<void>;
    paginatedOrders: Offer[] | undefined;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
    isWalletConnected,
    connectWallet,
    paginatedOrders = [],
    currentPage,
    totalPages,
    onPageChange,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders Created</CardTitle>
                <CardDescription>View all orders that have been created on the platform.</CardDescription>
                <CreateOrderDialog
                    isWalletConnected={isWalletConnected}
                    onConnectWallet={connectWallet}
                />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {paginatedOrders?.map((offer) => (
                        <OrderItem key={offer.id} offer={offer} />
                    ))}

                    {paginatedOrders?.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">No orders found</div>
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