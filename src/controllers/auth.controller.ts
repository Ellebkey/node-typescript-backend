import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import moment from 'moment';
import { db } from '@config/sequelize';
import envConfig from '@config/config';
import { logger } from '@config/logger';


const hours = 8;
const expiresIn = 60 * 60 * hours;

export class AuthController {
  public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = await db.User.findOne({ where: { username: req.body.username } });

      if (!user) {
        const customErr = {
          status: 404,
          message: 'El usuario no existe, favor de verificar',
          tag: 'data-not-found',
        };
        return next(customErr);
      }

      const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);

      if (!validPassword) {
        const customErr = {
          status: 401,
          message: 'Contraseña incorrecta.',
          tag: 'user-error-signin',
        };
        return next(customErr);
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          roles: user.roles,
        },
        envConfig.jwtSecret, { expiresIn },
      );

      return res.json({
        token,
        roles: user.roles,
        username: user.username,
        expiresIn: moment(new Date()).add(hours, 'hours').format(),
        displayName: user.displayName,
      });
    } catch (err) {
      logger.error('Error on login');
      return next(err);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const t = await db.sequelize.transaction();

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = {
        hashedPassword,
        displayName: `${req.body.firstName} ${req.body.lastName}`,
        username: req.body.username,
        roles: req.body.roles || ['user'],
      };

      await db.User.create(user, { transaction: t });

      const token = jwt.sign(
        {
          username: user.username,
          displayName: user.displayName,
          roles: user.roles,
        },
        envConfig.jwtSecret, { expiresIn },
      );

      await t.commit();

      return res.json({
        token,
        roles: user.roles,
        username: user.username,
        expiresIn: moment(new Date()).add(hours, 'hours').format(),
        displayName: user.displayName,
      });
    } catch (err) {
      await t.rollback();
      logger.error('Error on singup');
      return next(err);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const t = await db.sequelize.transaction();
    const { email, password } = req.body;

    try {
      const user = await db.User.findOne({ where: { email } });

      if (!user) {
        const customErr = {
          status: 404,
          message: 'El usuario no existe, favor de verificar',
          tag: 'data-not-found',
        };
        return next(customErr);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.update({ hashedPassword }, { transation: t });
      await t.commit();

      return res.json({
        response: 'success',
      });
    } catch (err) {
      await t.rollback();
      return next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const t = await db.sequelize.transaction();
    const { email } = req.body;

    const randomPassword = crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    try {
      const user = await db.User.findOne({ where: { email } });

      if (!user) {
        const customErr = {
          status: 404,
          message: 'El usuario no existe, favor de verificar',
          tag: 'data-not-found',
        };
        return next(customErr);
      }

      user.update({ hashedPassword }, { transation: t });
      await t.commit();

      return res.json({
        response: 'success',
      });
    } catch (err) {
      await t.rollback();
      return next(err);
    }
  }
}

export default AuthController;
