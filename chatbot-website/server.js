const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/message', async (req, res) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: req.body.message
      }],
    });
    res.json({ message: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
