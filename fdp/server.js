import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { ChatGPTAPI } from 'chatgpt';

const app = express();
const port = process.env.PORT || 3000;


app.use('/', cors());
app.use(express.json());

let messages = [];


async function example(promp) {
  // Directly use the API key as a string here. Replace 'your_api_key_here' with your actual API key.
  const api = new ChatGPTAPI({
    apiKey: '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',
    completionParams: {
      model: 'gpt-4',
      temperature: 0.5,
      top_p: 0.8
    }
  })

  let _prompt = "Du gibst die nächste/erste Antwort eines mitglieds der FDP in einer Konversation, deine Antworten, Werte, Meinungen und dein Rhetorik spiegelt das wieder. Die Konversation davor ist mit FDP: und Nutzer: dokumentiert.";
  _prompt += messages.toString();
  _prompt += "die neuste nachricht ist: " +promp
  messages.push("FDP: "+promp)
  console.log(_prompt)
  const res = await api.sendMessage(_prompt);
  messages.push("Nutzer: "+res.text)
  return(res.text);
}


app.post('/ask', async (req, res) => {
  try {
    let answer = await example(req.body.question);
    res.json({ answer: answer});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error communicating with the API');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
