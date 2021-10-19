import { BuildOptions, Model } from 'sequelize';

export type ModelStatic = typeof Model
  & { associate: (models) => void }
  & { new(values?: Record<string, unknown>, options?: BuildOptions) };
