import { Model } from 'sequelize';

export interface AccountAttributes {
  id?: string;
  name: string;
  currentAmount: string;
  isPrimary: boolean;
}

export interface AccountReq extends AccountAttributes, Model {
  isPrimary: boolean;
}

export interface AccountSectionAttributes {
  id?: string;
  name: string;
  comments: string;
  currentAmount: number;
  accountId: number;
}
