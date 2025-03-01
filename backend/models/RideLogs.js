module.exports = (sequelize, DataTypes) => {
    const RideLogs = sequelize.define('RideLogs', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      log: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
  
    RideLogs.associate = (models) => {
      RideLogs.belongsTo(models.Rides, { foreignKey: 'rideId' });
    };
  
    return RideLogs;
  };