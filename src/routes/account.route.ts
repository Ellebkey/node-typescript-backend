import { Router } from 'express';
import AccountController from '@controllers/account.controller';
import Auth from '@middlewares/auth';

export class AccountRoute {
  public accounts = new AccountController();
  public canAccess = new Auth().checkAuth;
  public router: Router = Router();

  public constructor() {
    this.init();
  }

  public init(): void {
    this.router.route('/accounts')
      .all(this.canAccess)
      .get(this.accounts.list)
      .post(this.accounts.create);

    this.router.route('/accounts/:thisAccountId')
      .all(this.canAccess)
      .get(this.accounts.read)
      .put(this.accounts.update)
      .delete(this.accounts.remove);

    this.router.route('/sections-account/:accountId')
      .all(this.canAccess)
      .get(this.accounts.listAccountSections);

    this.router.route('/sections-account-update')
      .all(this.canAccess)
      .post(this.accounts.updateAccountSections);

    this.router.route('/account-transfer')
      .all(this.canAccess)
      .post(this.accounts.transferAccount);

    this.router.param('thisAccountId', this.accounts.getById);
  }
}

// noinspection JSUnusedGlobalSymbols
export default new AccountRoute().router;
