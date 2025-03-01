module.exports = (sequelize, DataTypes) => {
    const Routes = sequelize.define('Routes', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      startLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      waypoints: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      travelTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  
    Routes.associate = (models) => {
      Routes.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Routes;
  };