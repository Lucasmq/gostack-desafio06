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
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (total, transaction) => {
        if (transaction.type === 'income') {
          total.income += transaction.value;
        } else if (transaction.type === 'outcome') {
          total.outcome += transaction.value;
        }
        return total;
      },
      {
        income: 0,
        outcome: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
