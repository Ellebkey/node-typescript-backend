import { Model } from 'sequelize';

export interface ArticleAttributes {
  id?: number;
  concept: string;
  details: string;
  brand: string;
  category: string;
  showDetail: never;
  ExpenseItem: never
}

export interface Article {
  concept: string;
  details: string;
  price: number;
  onDiscount: boolean;
  articleId: number;
  shouldSaveHistory: boolean;
}

export interface ArticleRecord {
  price: number;
  daySeen: string;
  discount: boolean;
  articleId: number;
  recipientId: number;
  expenseId: number;
}

export interface ArticleRecordAttributes extends ArticleRecord {
  id?: number;
}

export interface ArticleReq extends Article, Model {}
