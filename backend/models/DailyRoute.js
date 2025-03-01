module.exports = (sequelize, DataTypes) => {
  const DailyRoute = sequelize.define('DailyRoute', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID, // Assuming userId is a UUID
      allowNull: false,
    },
    startLocation: {
      type: DataTypes.JSON, // Store latitude/longitude as JSON
      allowNull: false,
    },
    endLocation: {
      type: DataTypes.JSON, // Store latitude/longitude as JSON
      allowNull: false,
    },
    middleLocations: {
      type: DataTypes.JSON, // Store array of latitude/longitude pairs
      allowNull: true,
    },
    fromDateTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    toDateTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    distance: {
      type: DataTypes.FLOAT, // Store distance in kilometers
      allowNull: false,
    },
    duration: {
      type: DataTypes.FLOAT, // Store duration in minutes
      allowNull: false,
    },
  });

  // Define associations
  DailyRoute.associate = (models) => {
    DailyRoute.belongsTo(models.User, { foreignKey: 'userId' }); // Assuming you have a User model
  };

  return DailyRoute;
};