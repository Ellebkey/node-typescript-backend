import { Sequelize, DataTypes, Model } from 'sequelize';
import { ModelStatic } from '@interfaces/sequelize.interface';
import { AccountAttributes } from '@interfaces/account.interfaces';

/**
 * Account Schema
 */
interface AccountInstance extends Model<AccountAttributes>, AccountAttributes {}

const AccountFactory = (sequelize: Sequelize): AccountInstance => {
  const attributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(50),
    },
    currentAmount: {
      field: 'current_amount',
      type: DataTypes.DECIMAL(10, 3),
    },
    isPrimary: {
      field: 'is_primary',
      type: DataTypes.BOOLEAN,
    },
  };

  const Account = <ModelStatic>sequelize
    .define<AccountInstance, AccountAttributes>('Account', attributes,
    {
      tableName: 'account',
      underscored: true,
      timestamps: false,
    });

  Account.associate = (models) => {
    Account.belongsTo(models.User, { as: 'user', foreignKey: 'owner_id' });
  };

  return <AccountInstance><unknown>Account;
};

export default AccountFactory;
