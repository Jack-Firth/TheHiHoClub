const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/docs")))

app.post('/subscribe', (req, res) => {
  const { firstName, email, js } = req.body;
  console.log(req.body);

  const mcData = {
    members: [
      {
        merge_fields: { FNAME: firstName },
        email_address: email,
        status: 'pending'
      }
    ]
  }

  const mcDataPost = JSON.stringify(mcData)

  const options = {
    url: 'https://us17.api.mailchimp.com/3.0/lists/e0ac112688/',
    method: 'POST',
    headers: {
      Authorization: 'auth 205bc6fc629216dbf410e92b6af73314-us17'
    },
    body: mcDataPost
  }

  if (email) {
    request(options, (err, response, body) => {
      if (err) {
        res.json({ error: err })
      } else {
        if (js) {
          res.sendStatus(200);
        } else {
          res.redirect('/html/success.html')
        }
      }
    })
  } else {
    res.status(404).send({ message: 'Failed' })
  }

})

const PORT = process.env.PORT || 5050;

app.listen(PORT, console.log("Server Started!"));
