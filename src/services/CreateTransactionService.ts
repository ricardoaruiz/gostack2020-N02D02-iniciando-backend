import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface CreateTransactionRequest {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: CreateTransactionRequest): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const objCategory = await this.getCategory(category);

    const { total } = await transactionRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError('transaction not allowed, insufficient balance');
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: objCategory,
    });

    const createdTransaction = await transactionRepository.save(transaction);
    return createdTransaction;
  }

  private async getCategory(category: string): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const foundCategory = await categoryRepository.findOne({
      where: { title: category },
    });
    if (foundCategory) {
      return foundCategory;
    }
    const newCategory = categoryRepository.create({
      title: category,
    });
    const createdCategory = await categoryRepository.save(newCategory);
    return createdCategory;
  }
}
export default CreateTransactionService;
