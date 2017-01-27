const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
require('dotenv').config()

// connect to the database and load models
const dburi = (process.env.NODE_ENV === 'production') ? config.dbUriH : config.dbUriL

require('./server/models').connect(dburi);



const app = express();
// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);


// start the server
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
// app.listen(3000, () => {
//   console.log('Server is running on http://localhost:3000 or http://127.0.0.1:3000');
// });