"use client";

import { TRANSACTION_TYPES, type TransactionTypeConfig } from "@/lib/accounts/transactionTypes";
import { TransactionTypeCard } from "./TransactionTypeCard";

type TransactionTypesGridProps = {
  onSelectType: (config: TransactionTypeConfig) => void;
};

export function TransactionTypesGrid({ onSelectType }: TransactionTypesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {TRANSACTION_TYPES.map((config) => (
        <TransactionTypeCard key={config.id} config={config} onSelect={onSelectType} />
      ))}
    </div>
  );
}
