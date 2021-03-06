import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = await getRepository(Transaction);

    const transaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    } else {
      await transactionRepository.remove(transaction);
    }
  }
}

export default DeleteTransactionService;
