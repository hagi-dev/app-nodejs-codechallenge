export interface DataCreate {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}
export interface TransactionType {
  name: string;
}

export interface TransactionStatus {
  name: string;
}
export interface ResponseTransactionCreate {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  value: number;
  createdAt: Date;
}
