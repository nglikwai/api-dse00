export const databaseConfig = () => ({
  uri: process.env.DB_URL || 'mongodb://localhost:27017/dse00',
});
