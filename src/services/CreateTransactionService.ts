import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const categoryRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Type not exists', 400);
    }

    let newCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!newCategory) {
      newCategory = await categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);
    }

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome') {
      if (total - value <= 0) {
        throw new AppError('No money left', 400);
      }
    }

    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category: newCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
