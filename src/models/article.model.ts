import { Sequelize, DataTypes, Model } from 'sequelize';
import { ModelStatic } from '@interfaces/sequelize.interface';
import { ArticleAttributes } from '@interfaces/article.interfaces';

/**
 * Article Schema
 */

interface ArticleInstance extends Model<ArticleAttributes>, ArticleAttributes {}

const ArticleFactory = (sequelize: Sequelize): ArticleInstance => {
  const attributes = {
    concept: {
      type: DataTypes.STRING(255),
    },
    details: {
      type: DataTypes.TEXT,
    },
    brand: {
      type: DataTypes.STRING(50),
    },
    category: {
      type: DataTypes.STRING(50),
    },
    showDetail: {
      type: DataTypes.VIRTUAL,
      get() {
        return false;
      },
    },
    ExpenseItem: { // this virtual attribute allows to easy save M:N data
      type: DataTypes.VIRTUAL,
    },
  };

  const Article = <ModelStatic>sequelize
    .define<ArticleInstance, ArticleAttributes>('Article', attributes,
    {
      tableName: 'article',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });

  return <ArticleInstance><unknown>Article;
};

export default ArticleFactory;
