import mongoose from 'mongoose';

const connectionString = 'mongodb://localhost:27017/nht';

mongoose.set('strictQuery', false);

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

export default mongoose;
