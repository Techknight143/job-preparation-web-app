require('dotenv').config()
const app = require('./src/app')
const connectToDB = require('./src/config/db');


connectToDB();


app.listen(process.env.PORT,'0.0.0.0',() => {
    console.log(`Server is listening to the port ${process.env.PORT}`);
});

