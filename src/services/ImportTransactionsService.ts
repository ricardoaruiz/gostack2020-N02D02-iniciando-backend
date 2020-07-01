import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import { config } from '../config/uploadConfig';

import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const fileContent = fs.readFileSync(
      path.join(config.destination, fileName),
      'utf8',
    );
    const lines = fileContent.split(/\r?\n/);

    const transactions: Transaction[] = [];

    let index = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const line of lines) {
      const [title, type, value, category] = line.split(',');
      if (index > 0 && index < lines.length - 1) {
        transactions.push(
          // eslint-disable-next-line no-await-in-loop
          await createTransactionService.execute({
            title: title ? title.trim() : '',
            type: type ? type.trim() : '',
            value: value ? +value : 0,
            category: category ? category.trim() : '',
          }),
        );
      }
      // eslint-disable-next-line no-plusplus
      index++;
    }
    return transactions;
  }
}

export default ImportTransactionsService;
