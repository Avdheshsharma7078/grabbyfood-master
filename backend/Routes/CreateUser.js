const express = require("express");
const router = express.Router();
const user = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = "MyNameismahyankKumar"
const axios = require('axios');
//Signup
router.post(
  "/createuser",
  // username must be an email
  body("email").isEmail(),
  body("name").isLength({ min: 5 }),
  // password must be at least 5 chars long
  body("password", "Incorrect Password").isLength({ min: 5 }),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
      await user.create({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        password: secPassword,
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);


router.post('/getlocation', async (req, res) => {
  try {
      let lat = req.body.latlong.lat
      let long = req.body.latlong.long
      console.log(lat, long)
      let location = await axios
          .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=74c89b3be64946ac96d777d08b878d43")
          .then(async res => {
              // console.log(`statusCode: ${res.status}`)
              console.log(res.data.results)
              // let response = stringify(res)
              // response = await JSON.parse(response)
              let response = res.data.results[0].components;
              console.log(response)
              let { village, county, state_district, state, postcode } = response
              return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
          })
          .catch(error => {
              console.error(error)
          })
      res.send({ location })

  } catch (error) {
      console.error(error.message)
      res.send("Server Error")

  }
})


//Login
router.post(
  "/loginuser",
  [
    // username must be an email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let email = req.body.email;

    try {
      let userData = await user.findOne({ email });

      if (!userData) {
        return res
          .status(400)
          .json({ errors: "Try login with correct credentials" });
      }

      const pwdCompare = await bcrypt.compare(req.body.password, userData.password);

      if (!pwdCompare) {
        return res
          .status(400)
          .json({ errors: "Try login with correct credentials" });
      }

      const data = {
        user: {
          id: userData.id
        }
      }
      const authToken = jwt.sign(data, jwtSecret);
      return res.json({ success: true, authToken: authToken});
    
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

router.post('/getlocation', async (req, res) => {
  try {
      let lat = req.body.latlong.lat
      let long = req.body.latlong.long
      console.log(lat, long)
      let location = await axios
          .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=74c89b3be64946ac96d777d08b878d43")
          .then(async res => {
              // console.log(`statusCode: ${res.status}`)
              console.log(res.data.results)
              // let response = stringify(res)
              // response = await JSON.parse(response)
              let response = res.data.results[0].components;
              console.log(response)
              let { village, county, state_district, state, postcode } = response
              return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
          })
          .catch(error => {
              console.error(error)
          })
      res.send({ location })

  } catch (error) {
      console.error(error.message)
      res.send("Server Error")

  }
})
module.exports = router;