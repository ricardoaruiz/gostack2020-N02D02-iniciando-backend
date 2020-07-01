import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find({ relations: ['category'] });
    const income = this.getTotalByType('income', transactions);
    const outcome = this.getTotalByType('outcome', transactions);

    return {
      income: +income,
      outcome: +outcome,
      total: income - outcome,
    };
  }

  private getTotalByType(
    type: 'income' | 'outcome',
    transactions: Transaction[],
  ): number {
    return transactions
      .filter(transaction => transaction.type === type)
      .map(transaction => transaction.value)
      .reduce((prev, current) => {
        return +prev + +current;
      }, 0);
  }
}

export default TransactionsRepository;
