module.exports = (sequelize, DataTypes) => {
    const RideAvailable = sequelize.define('RideAvailable', {
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
      travelTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    });
  
    RideAvailable.associate = (models) => {
      RideAvailable.belongsTo(models.User, { foreignKey: 'userId' });
      RideAvailable.hasOne(models.Rides, { foreignKey: 'rideAvailableId' });
    };
  
    return RideAvailable;
  };