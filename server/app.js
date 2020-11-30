const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config/key');
const cors = require('cors');


require('./model/user');
app.use(express.json());
app.use(cors());
require('./middleware/requireLogin')


app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/build")));
//      const path = require('path');
//     app.get("*", (req, res) =>
//       res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
//     );
//   } else {
//     app.get("/", (req, res) => {
//       res.send("API is running....");
//     });
// }

//Connect MDb

mongoose.connect(MONGO_URI,{useUnifiedTopology:true,useNewUrlParser:true,useFindAndModify:false})
.then(()=>console.log('Connected Successfully!'))
.catch((err) =>console.log(err))

const PORT = process.env.PORT || 9000

app.listen(PORT,()=>console.log(`listening in.....${PORT}`) )