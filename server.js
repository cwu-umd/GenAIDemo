// const express = require("express");
// const cors = require("cors")
// const {GoogleGenerativeAI} = require("@google/generative-ai")



import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {GoogleGenerativeAI} from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEN_AI_KEY_H)
const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"})

const app = express()
app.use(cors())
app.use(express.json())

app.post("/submit-form", async (req, res) => {
    const {content} = req.body;
    console.log("Received: ", req.body);

    const prompt = content
    const result = await model.generateContent(prompt)

    // console.log(result)
    console.log(result.response.text())

    res.json({message: result.response.text()})
});


app.listen(5501, () => {
    console.log("I am the server handling request backend on port 5501")
})

