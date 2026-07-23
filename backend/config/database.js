const mongoose = require("mongoose");

const connectDatabase = () => {
  return mongoose
    .connect(process.env.DB_LOCAL_URI, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   useCreateIndex: true,
    })
    .then((con) => {
      console.log(
        `MongoDB Database connected with HOST:${con.connection.host}`
      );
      return con;
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.error(
        "If you're using MongoDB Atlas, make sure your current IP address is added to the cluster's IP access list (Network Access tab)."
      );
      throw err;
    });
};
module.exports = connectDatabase;
