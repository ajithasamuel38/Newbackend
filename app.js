const express = require("express");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const path =require('path');
const fs = require('fs');
const morgan = require('morgan');
require('dotenv').config();


const sequelize = require("./config/db"); 

const adminroutes = require("./routes/adminroutes")

const expenseroutes = require("./routes/expenseroutes")

const purchaseroutes = require("./routes/premiumroutes");
const premiumeroutes = require("./routes/leaderboard");
const forgotpassroutes = require('./routes/forgotpass');
const errorController = require('./controllers/error');

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/orders");
const Forgotpass = require("./models/forgotpass");
const FileUrl = require('./models/FileUrl');
const cors = require('cors'); 

const app = express();
//app.use(helmet());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());

app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',adminroutes);
app.use(expenseroutes);
app.use('/purchase',purchaseroutes);
app.use('/premium', premiumeroutes);
app.use(forgotpassroutes);
app.use(errorController.get404);

app.get('*', (req, res) => {
    console.log('Url', req.url);
    res.sendFile(path.join(__dirname, 'public', `${req.url}`));
});


User.hasMany(Expense, { as: 'expense'});
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpass);
Forgotpass.belongsTo(User);

User.hasMany(FileUrl);
FileUrl.belongsTo(User);

const PORT = process.env.PORT || 3000;

sequelize.sync()
.then((result)=>{
    console.log(result);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err)=>{
    console.log(err)
});