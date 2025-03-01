module.exports = (sequelize, DataTypes) => {
    const RideRequest = sequelize.define('RideRequest', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      pickupLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dropoffLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
    });
  
    RideRequest.associate = (models) => {
      RideRequest.belongsTo(models.User, { foreignKey: 'userId' });
      RideRequest.hasOne(models.Rides, { foreignKey: 'rideRequestId' });
    };
  
    return RideRequest;
  };