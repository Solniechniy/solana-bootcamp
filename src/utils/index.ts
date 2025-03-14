import { clsx, type ClassValue } from "clsx";
import { gql } from "graphql-request";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, length: number = 8): string {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export const METADATA = {
  ["GdHsojisNu8RH92k4JzF1ULzutZgfg8WRL5cHkoW2HCK"]: {
    address: "GdHsojisNu8RH92k4JzF1ULzutZgfg8WRL5cHkoW2HCK",
    decimals: 9,
    icon: "🌭",
    symbol: "HOT",
  },
  ["9NCKufE7BQrTXTang2WjXjBe2vdrfKArRMq2Nwmn4o8S"]: {
    address: "9NCKufE7BQrTXTang2WjXjBe2vdrfKArRMq2Nwmn4o8S",
    decimals: 9,
    icon: "🍔",
    symbol: "Burger",
  },
};

export function getMetadata(tokenId?: string) {
  if (METADATA[tokenId as keyof typeof METADATA]) {
    return METADATA[tokenId as keyof typeof METADATA];
  }
  return { decimals: 9, icon: "🍔", symbol: "UNKNOWN" };
}

export const query = gql`
  {
    offers(first: 100) {
      id
      closed
      trxHashOffer
      trxHashTake

      tokenAOfferedAmount
      tokenBWantedAmount

      acctMaker
      acctTaker

      acctTokenMintA
      acctTokenMintB

      acctMakerTokenAccountA
      acctTakerTokenAccountA
      acctTakerTokenAccountB
      acctMakerTokenAccountB

      acctOffer
      acctVault
      acctTokenProgram
    }
  }
`;

export const userOffers = gql`
  {
    offers(where: { acctMaker: $acctMaker }) {
      id
      closed
      trxHashOffer
      trxHashTake

      tokenAOfferedAmount
      tokenBWantedAmount

      acctMaker
      acctTaker

      acctTokenMintA
      acctTokenMintB

      acctMakerTokenAccountA
      acctTakerTokenAccountA
      acctTakerTokenAccountB
      acctMakerTokenAccountB

      acctOffer
      acctVault
      acctTokenProgram
    }
  }
`;
