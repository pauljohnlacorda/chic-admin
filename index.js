const express = require('express');
const path = require ('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const bodyParser = require('body-parser');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // append the file extension
  }
});

const upload = multer({ storage: storage });
const app = express();





//routers
const serviceRouter = require('./server/routers/serviceRouter');

//configuration ejs-mate
app.engine('ejs', ejsMate);

//configuration and parse from data
app.set('views',path.join(__dirname, '/client/views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true }));

//configure method-override
app.use(methodOverride('_method'));

app.use('/static', express.static(path.join(__dirname, 'client/views/public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(bodyParser.json());



//excute Routers
app.use('', serviceRouter);

//for request that do not exist: 404 route
app.use('*',( req, res, next) => {
  next(new ExpressError('Page not found', 404));
})

// error middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  res.status(statusCode).render('error', {err});
});

app.listen(8080, () => {
  console.log('Server is now up and running.Listening on post 8080');
})