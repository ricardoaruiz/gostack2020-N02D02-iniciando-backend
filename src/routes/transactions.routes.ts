import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import upaload from '../config/uploadConfig';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find({ relations: ['category'] });

  const mappedTransactions = transactions.map(transaction => ({
    ...transaction,
    value: +transaction.value,
  }));

  const balance = await transactionRepository.getBalance();
  response.json({ transactions: mappedTransactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransactionService = new CreateTransactionService();
  const createdTransaction = await createTransactionService.execute({ title, value, type, category });
  response.json(createdTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  deleteTransactionService.execute(id);
  response.status(204).send();
});

transactionsRouter.post('/import', upaload.single('file'), async (request, response) => {
  const importTransactionsService = new ImportTransactionsService();
  const transactions = await importTransactionsService.execute(request.file.filename);
  response.status(201).json(transactions);
});

export default transactionsRouter;
