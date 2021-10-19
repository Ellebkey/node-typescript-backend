import { Request, Response, NextFunction } from 'express';
import { db } from '@config/sequelize';
import { logger } from '@config/logger';

export class AccountController {
  public async getById(req: Request, res: Response, next: NextFunction, id: string): Promise<Response | void> {
    try {
      const account = await db.Account.findByPk(id);
      if (!account) {
        const customErr = {
          status: 404,
          message: `Account with id: ${id}, was not found`,
          tag: 'data-not-found',
        };
        return next(customErr);
      }

      req.account = account;
      return next();
    } catch (err) {
      logger.error('Error on getting single account');
      return next(err);
    }
  }

  public async read(req: Request, res: Response): Promise<Response> {
    return res.json(req.account);
  }

  public async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { limit = 50, offset = 0 } = req.query;

    try {
      const accounts = await db.Account.findAll({
        where: { isPrimary: true },
        limit: +limit,
        offset: +offset,
        attributes: [
          'id',
          'name',
          'currentAmount',
          ['current_amount', 'value'],
        ],
        order: [['name', 'ASC']],
      });

      logger.info('getting accounts list');

      return res.json(accounts);
    } catch (err) {
      logger.error('Error on getting accounts list');
      return next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const t = await db.sequelize.transaction();
    const account = req.body;

    try {
      const savedAccount = await db.Account.create(account, { transaction: t });

      await t.commit();
      return res.json(savedAccount);
    } catch (err) {
      await t.rollback();
      logger.error('Error on create account');
      return next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { account } = req;
    const t = await db.sequelize.transaction();
    try {
      const updatedAccount = await account.save();
      await t.commit();

      return res.json(updatedAccount);
    } catch (err) {
      await t.rollback();
      logger.error('Error on account update');
      return next(err);
    }
  }

  public async remove(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { account } = req;

    const t = await db.sequelize.transaction();
    try {
      await account.destroy({ transaction: t });
      await t.commit();

      return res.json({
        response: 'success',
      });
    } catch (err) {
      await t.rollback();
      logger.error('Error on account delete');
      return next(err);
    }
  }

  public async listAccountSections(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { limit = 50, offset = 0 } = req.query;
    const { accountId } = req.params;

    try {
      const sections = await db.AccountSection.findAll({
        where: {
          accountId,
        },
        limit: +limit,
        offset: +offset,
        attributes: [
          'id',
          'name',
          'comments',
          'currentAmount',
        ],
        order: [['name', 'ASC']],
      });

      return res.json(sections);
    } catch (err) {
      logger.error('Error on listing section account');
      return next(err);
    }
  }

  public async updateAccountSections(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const section = req.body;
    const t = await db.sequelize.transaction();
    try {
      const sectionForUpdate = await db.AccountSection.findOne({
        where: { id: section.id },
      });

      const account = await db.Account.findOne({ where: { id: section.accountId } });

      if (section.movementType === 'retiro') {
        await account.increment('current_amount', { by: section.amount, transaction: t });
        await sectionForUpdate.decrement('current_amount', { by: section.amount, transaction: t });
      } else {
        await account.decrement('current_amount', { by: section.amount, transaction: t });
        await sectionForUpdate.increment('current_amount', { by: section.amount, transaction: t });
      }

      await db.Transaction.create(
        {
          movementDate: section.movementDate,
          amount: section.amount,
          concept: `${section.movementType} apartado`,
          movementType: 'ahorro',
          accountId: account.id,
        },
        { transaction: t },
      );

      await t.commit();
      return res.json(sectionForUpdate);
    } catch (err) {
      await t.rollback();
      logger.error('Error on update account sections delete');
      return next(err);
    }
  }

  public async transferAccount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const transfer = req.body;
    const t = await db.sequelize.transaction();

    try {
      const sourceAccount = await db.Account.findOne({ where: { id: transfer.sourceAccountId } });
      const destinyAccount = await db.Account.findOne({ where: { id: transfer.destinyAccountId } });

      await db.Transaction.create(
        {
          movementDate: transfer.movementDate,
          amount: transfer.amount,
          concept: 'transferencia',
          movementType: transfer.movementType,
          accountId: sourceAccount.id,
          accountLatestAmount: sourceAccount.currentAmount,
        },
        { transaction: t },
      );
      await db.Transaction.create(
        {
          movementDate: transfer.movementDate,
          amount: transfer.amount,
          concept: 'transferencia',
          movementType: transfer.movementType,
          accountId: destinyAccount.id,
          accountLatestAmount: destinyAccount.currentAmount,
        },
        { transaction: t },
      );

      await sourceAccount.decrement('current_amount', { by: transfer.amount, transaction: t });
      await destinyAccount.increment('current_amount', { by: transfer.amount, transaction: t });

      await t.commit();
      return res.json(destinyAccount);
    } catch (err) {
      await t.rollback();
      logger.error('Error on transfering between accounts');
      return next(err);
    }
  }
}

export default AccountController;
