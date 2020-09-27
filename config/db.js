const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://musa24:musa24@cluster0.udesg.mongodb.net/ideasBD?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    );

    console.log('MongoDB is connected');
  } catch (error) {
    console.log(err);
  }
};

connectToDB();
