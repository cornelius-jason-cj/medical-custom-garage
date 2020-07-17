const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config')
const cors = require('cors')
const path = require('path')

const session = require('express-session')
const passport = require('passport')
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: config.DB_URI,
  collection: 'medicalCustomSessions'
})

store.on('err', (error) => console.log(error))

require('./services/passport');

const itemRoutes = require('./routes/items')
const progressRoutes = require('./routes/progress')
const invoiceRoutes = require('./routes/invoice')
const profitRoutes = require('./routes/profit')
const belanjaRoutes = require('./routes/belanja')
const userRoutes = require('./routes/user')

mongoose.connect(config.DB_URI, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('MongoDB Connection Successful!');
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(session({ secret: config.SESSION_SECRET,
                  cookie: { maxAge: 3600000 },
                  resave: false,
                  saveUninitialized: false,
                  store
                  }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/items', itemRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/profit', profitRoutes);
app.use('/api/belanja', belanjaRoutes);
app.use('/api/user', userRoutes);

// if (process.env.NODE_ENV === 'production') {
  const appPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(appPath));

  app.get('*', function(req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
  });
// }


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
