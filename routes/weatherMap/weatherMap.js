const express = require('express')
const router = express.Router()
const axios = require('axios')

// OPEN WEATHER MAP API //
router.get("/api/openWeatherMap/ipah1", async (req, res) => {
  try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast?lat=1.9340&lon=103.1841&appid=45a2a23d23c78dbe34c5fbd75a591573&units=metric")
      res.json(response.data)
  }
  catch (err) {
      console.log(err)
  }
})

router.get("/api/openWeatherMap/ipah2", async (req, res) => {
  try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast?lat=1.9340&lon=103.1841&appid=45a2a23d23c78dbe34c5fbd75a591573&units=metric")
      res.json(response.data)
  }
  catch (err) {
      console.log(err)
  }
})

router.get("/api/openWeatherMap/tkpmPagoh", async (req, res) => {
  try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast?lat=2.1381&lon=102.7395&appid=45a2a23d23c78dbe34c5fbd75a591573&units=metric")
      res.json(response.data)
      console.log(res)
  }
  catch (err) {
      console.log(err)
  }
})

router.get("/api/openWeatherMap/kongPo", async (req, res) => {
  try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast?lat=1.5135&lon=103.9605&appid=45a2a23d23c78dbe34c5fbd75a591573&units=metric")
      res.json(response.data)
  }
  catch (err) {
      console.log(err)
  }
})

module.exports = router