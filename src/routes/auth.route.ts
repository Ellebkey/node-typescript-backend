import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import Auth from '@middlewares/auth';

export class AuthRouter {
  public userController = new AuthController();
  public canAccess = new Auth().checkAuth;
  public router: Router = Router();

  public constructor() {
    this.init();
  }

  public init(): void {
    this.router.post('/auth/login', this.userController.login);
    this.router.post('/auth/signup', this.userController.register);
    this.router.post('/auth/reset', this.canAccess, this.userController.resetPassword);
    this.router.post('/auth/change-password', this.canAccess, this.userController.changePassword);
  }
}

// noinspection JSUnusedGlobalSymbols
export default new AuthRouter().router;
