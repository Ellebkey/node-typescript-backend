import { Request, Response, NextFunction } from 'express';
import { db } from '@config/sequelize';
import { logger } from '@config/logger';
import { queryArticles, queryCount, queryHistory, queryArticleRecords } from '@queries/article.queries';
import { Article } from '@interfaces/article.interfaces';

export class ArticleController {
  public async getById(req: Request, res: Response, next: NextFunction, id: string): Promise<Response | void> {
    try {
      const article = await db.Article.findByPk(id);

      if (!article) {
        const customErr = {
          status: 404,
          message: `Article with id: ${id}, was not found`,
          tag: 'data-not-found',
        };
        return next(customErr);
      }

      req.article = article;
      return next();
    } catch (err) {
      logger.error('Error on getting single article');
      return next(err);
    }
  }

  public async read(req: Request, res: Response): Promise<Response> {
    return res.json(req.article);
  }

  public async create(
    req: Request<unknown, unknown, Article>, res: Response, next: NextFunction,
  ): Promise<Response | void> {
    const t = await db.sequelize.transaction();
    const article = req.body;

    try {
      const savedArticle = await db.Article.create(article, { transaction: t });

      await t.commit();
      return res.json(savedArticle);
    } catch (err) {
      await t.rollback();
      logger.error('Error on create article');
      return next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { article } = req;
    const t = await db.sequelize.transaction();

    try {
      const updatedArticle = await article.save();
      await t.commit();

      return res.json(updatedArticle);
    } catch (err) {
      await t.rollback();
      logger.error('Error on article update');
      return next(err);
    }
  }

  public async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const {
      limit = 50, offset = 0,
    } = req.query;

    try {
      const searchText = (req.query.searchText && req.query.searchText !== 'null')
        ? `%${req.query.searchText}%`.toUpperCase()
        : '%%';

      const [articles] = await db.sequelize.query(queryArticles, {
        replacements: {
          limit, offset, searchText,
        },
      });
      const [[count]] = await db.sequelize.query(queryCount, {
        replacements: { searchText },
      });

      logger.info('getting articles list');
      return res.json({
        rows: articles,
        count: +count.count,
      });
    } catch (err) {
      logger.error('Error on getting articles list');
      return next(err);
    }
  }

  public async remove(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { article } = req;

    const t = await db.sequelize.transaction();
    try {
      await article.destroy({ transaction: t });
      await t.commit();

      return res.json({
        response: 'success',
      });
    } catch (err) {
      await t.rollback();
      logger.error('Error on article delete');
      return next(err);
    }
  }

  public async getArticleHistory(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { articleId } = req.params;

    try {
      const article = await db.Article.findByPk(articleId);

      const [articles] = await db.sequelize.query(queryHistory, {
        replacements: { articleId },
      });

      if (!articles) {
        const customErr = {
          status: 404,
          message: `Article history with id: ${articleId}, was not found`,
          tag: 'data-not-found',
        };
        return next(customErr);
      }

      const history = {
        name: article.concept,
        series: [],
      };

      articles.forEach((articleItem) => {
        history.series.push({
          name: articleItem.daySeen,
          value: +articleItem.price,
          business: articleItem.recipient,
          discount: articleItem.discount,
        });
      });
      return res.json([history]);
    } catch (err) {
      logger.error('Error on getting articles list');
      return next(err);
    }
  }

  public async createArticleHistory(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const t = await db.sequelize.transaction();
    const article = req.body;

    try {
      const savedArticle = await db.ArticleRecord.create(article, { transaction: t });

      await t.commit();
      return res.json(savedArticle);
    } catch (err) {
      await t.rollback();
      logger.error('Error on create article');
      return next(err);
    }
  }

  public async deleteArticleRecords(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const [recurrents] = await db.sequelize.query(queryArticleRecords);
      logger.info('deleting article records');
      return res.json({
        rows: recurrents,
      });
    } catch (err) {
      logger.error('Error in deleting article records ');
      return next(err);
    }
  }
}

export default ArticleController;
