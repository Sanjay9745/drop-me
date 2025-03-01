module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDriver: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  
    User.associate = (models) => {
      User.hasMany(models.RideRequest, { foreignKey: 'userId' });
      User.hasMany(models.RideAvailable, { foreignKey: 'userId' });
      User.hasMany(models.Rides, { foreignKey: 'userId' });
      User.hasMany(models.DailyRoute, { foreignKey: 'userId' });
    };
  
    return User;
  };