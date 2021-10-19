import { Sequelize, DataTypes, Model } from 'sequelize';
import { ModelStatic } from '@interfaces/sequelize.interface';
import { UserAttributes } from '@interfaces/user.interfaces';

/**
 * User Schema
 */

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

const UserFactory = (sequelize: Sequelize): UserInstance => {
  const attributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUnique: async (value, next) => {
          try {
            const user = await User.findOne({
              where: { username: value },
            });
            if (user && user.username === value) {
              return next('Ya existe un registro con este correo.');
            }
            return next();
          } catch (e) {
            return next(e);
          }
        },
      },
    },
    hashedPassword: {
      field: 'hashed_password',
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      field: 'mobile_number',
      type: DataTypes.STRING,
    },
    roles: {
      type: DataTypes.JSON,
      defaultValue: ['user'],
      isArray: true,
    },
  };

  const User = <ModelStatic>sequelize
    .define<UserInstance, UserAttributes>('User', attributes,
    {
      tableName: 'user',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });

  User.associate = (models) => {
    User.hasMany(models.Account, { as: 'accounts', foreignKey: 'owner_id' });
  };

  return <UserInstance><unknown>User;
};

export default UserFactory;
