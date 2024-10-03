const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      /* useNewUrlParser: true,
      useUnifiedTopology: true, */
    });
    console.log('MongoDB child connected');
  } catch (error) {
    console.error('MongoDB child connection error:', error);
    process.exit(1);
  }
};


const connect_parent_DB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_PARENT_URI, {
      /* useNewUrlParser: true,
      useUnifiedTopology: true, */
    });
    console.log('MongoDB parent db connected');
  } catch (error) {
    console.error('MongoDB parent db connection error:', error);
    process.exit(1);
  }
};

module.exports = {connectDB,connect_parent_DB};
