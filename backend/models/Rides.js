module.exports = (sequelize, DataTypes) => {
    const Rides = sequelize.define('Rides', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'ongoing',
      },
    });
  
    Rides.associate = (models) => {
      Rides.belongsTo(models.User, { foreignKey: 'userId' });
      Rides.belongsTo(models.RideRequest, { foreignKey: 'rideRequestId' });
      Rides.belongsTo(models.RideAvailable, { foreignKey: 'rideAvailableId' });
    };
  
    return Rides;
  };