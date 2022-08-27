require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/message');

// express app
const app = express();
const PORT = process.env.PORT || 5000;

// connect to mongoDB
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zt9bkiw.mongodb.net/learning?retryWrites=true&w=majority`;
mongoose.connect(dbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    })
  })
  .catch(console.log)


// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.json({
  type: "*/*"
}))


app.get('/', (req, res) => {
  res.render('index', { title: 'Home', active: req.url });
})

app.get('/about', (req, res) => {
  const options = {
    title: 'About',
    active: req.url,
    name: process.env.ADMIN_NAME,
    about: process.env.ADMIN_BIO,
    img: process.env.ADMIN_IMAGE,
    github: process.env.ADMIN_GITHUB,
    twitter: process.env.ADMIN_TWITTER,
    website: process.env.ADMIN_WEBSITE,
  }
  res.render('about', options);
})

app.get('/contact-me', (req, res) => {
  const options = {
    title: 'Contact me',
    active: req.url,
    address: process.env.ADMIN_ADDRESS,
    email: process.env.ADMIN_EMAIL,
    phone: process.env.ADMIN_PHONE,
    success: req.query.sent === 'success' ? true : false
  }
  res.render('contact-me', options);
})


app.post('/send-message', (req, res) => {
  const { name, email, message: msg } = req.body
  const message = new Message({
    email,
    message: msg || "There is no message",
    name: name || "Anonymous"
  });
  message.save()
    .then(() => {
      res.json({
        success: true
      })
    })
    .catch((err) => {
      res.json({
        success: false
      })
      console.log(err)
    });
})

app.use((req, res) => {
  res.render('404', { title: 'Error 404 | Not Found', active: req.url });
});