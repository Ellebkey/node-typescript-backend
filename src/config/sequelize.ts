import { Sequelize } from 'sequelize';
import AccountFactory from '@models/account.model';
import UserFactory from '@models/user.model';
import ArticleFactory from '@models/article.model';
import ArticleRecordFactory from '@models/article-records.model';
import CategoryFactory from '@models/category.model';
import ExpenseFactory from '@models/expense.model';
import ExpenseItemFactory from '@models/expense-item.model';
import IncomeFactory from '@models/income.model';
import PaymentMethodFactory from '@models/payment-method.model';
import RecipientFactory from '@models/recipient.model';
import RecurrentExpenseFactory from '@models/recurrent-expense.model';
import TransactionFactory from '@models/transactions.model';
import envConfig from './config';
import { logger } from './logger';

export const db: any = {};

export class SequelizeDB {
  db: string;
  user: string;
  password: string;
  host: string;
  port: number;
  maxPool: number;
  minPool: number;

  constructor() {
    this.db = envConfig.sql.db;
    this.user = envConfig.sql.user;
    this.password = envConfig.sql.password;
    this.host = envConfig.sql.host;
    this.port = Number(envConfig.sql.port);
    this.maxPool = Number(envConfig.MAX_POOL) || 10;
    this.minPool = Number(envConfig.MIN_POOL) || 1;
  }

  initDataBase = async (): Promise<void> => {
    try {
      logger.info('Initializing PostgreSQL Database');
      const sequelize = new Sequelize(this.db, this.user, this.password, {
        host: this.host,
        dialect: 'postgres',
        port: this.port,
        logging: (msg) => logger.verbose(msg),
        pool: {
          max: this.maxPool,
          min: this.minPool,
          acquire: 30000,
          idle: 10000,
        },
      });

      db.sequelize = sequelize;
      db.User = UserFactory(sequelize);
      db.Account = AccountFactory(sequelize);
      db.Article = ArticleFactory(sequelize);
      db.ArticleRecord = ArticleRecordFactory(sequelize);
      db.Category = CategoryFactory(sequelize);
      db.Expense = ExpenseFactory(sequelize);
      db.ExpenseItem = ExpenseItemFactory(sequelize);
      db.Income = IncomeFactory(sequelize);
      db.PaymentMethod = PaymentMethodFactory(sequelize);
      db.Recipient = RecipientFactory(sequelize);
      db.RecurrentExpense = RecurrentExpenseFactory(sequelize);
      db.Transaction = TransactionFactory(sequelize);

      Object.keys(db)
        .forEach((modelName) => {
          if (db[modelName].associate) {
            db[modelName].associate(db);
          }
        });

      await sequelize.authenticate();
      logger.info('Connection has been established successfully.');
      await sequelize.sync();
      logger.info('PostgreSQL Database synchronized');
    } catch (e) {
      logger.error('Unable to connect to the database:', e);
    }
  };
}
