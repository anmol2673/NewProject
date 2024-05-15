require('./dbConnect/Config');
const { OpenAI } = require('openai');
const express = require("express");
const cors = require('cors');
const User = require('./dbConnect/User');
const Content = require('./dbConnect/NewContent')
const { v4: uuidv4 } = require('uuid'); // Import the uuid package
//const fetch = require('node-fetch');

//const fetch = require('node-fetch').default; // Require node-fetch for making HTTP requests

const app = express();
require('dotenv').config();

app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI instance
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Validate environment variable
if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    process.exit(1); // Exit the process with a non-zero exit code
}

// Handle the login page
app.post("/login", async (req, resp) => {
    try {
        let user = await User.findOne(req.body).select("-password");
        console.log(user);
        if (user) {
            resp.send(user);
        } else {
            resp.send({ result: 'no user found' });
        }
    } catch (error) {
        console.error('User DB Error:', error);
        resp.status(500).json({ error: 'Internal server error' });
    }
});

let generatedContent = '';

// Handle content generation using OpenAI
app.post("/generate-content", async (req, res) => {
    
    const { Stream } = require('openai/streaming');
    const {writeTopic,targetedWords,contentType,numberOfWords,creativity,language,variants,model} = req.body;
   
    console.log("req body",req.body);


   // console.log("Received writeTopic:", writeTopic.message);

    try {
         // Define default parameters
         let model = 'gpt-3.5-turbo-0125';
         let messages = [
             { "role": "system", "content": `You’re a professional blogger with deep knowledge about ${targetedWords.join(', ')}. All titles must be under ${numberOfWords} words.` },
             { "role": "user", "content": `Craft compelling ${contentType} for ${writeTopic}.` }
         ];
         let temperature = 0.8; // Default temperature
         let n = variants; // Number of variants

         if (contentType === 'titles') {
            // Configure parameters for generating titles
            temperature = creativity === 'regular' ? 0.8 : 0.2; // Set temperature based on creativity level
            messages = [
                { "role": "system", "content": `You’re a professional blogger with deep knowledge about ${targetedWords.join(', ')}. All titles must be under ${numberOfWords} words.` },
                { "role": "user", "content": `Craft compelling titles for ${writeTopic}.` }
            ];
        } else if (contentType === 'outline') {
            // Customize parameters for generating outlines
            // You can add specific configurations for other content types here
            temperature = creativity === 'regular' ? 0.8 : 0.2;
            messages = [
                { "role": "system", "content": `You’re a professional blogger with deep knowledge about ${targetedWords.join(', ')}. All outlines must be under ${numberOfWords} words.` },
                { "role": "user", "content": `Craft compelling outlines for ${writeTopic}.` }
            ];
        }else if(contentType === 'conclusion'){
              // You can add specific configurations for other content types here
              temperature = creativity === 'regular' ? 0.8 : 0.2;
              messages = [
                  { "role": "system", "content": `You’re a professional blogger with deep knowledge about ${targetedWords.join(', ')}. All conclusions must be of ${numberOfWords} words.` },
                  { "role": "user", "content": `Craft compelling conclusion for ${writeTopic}.` }
              ];
        }

        const uniqueId = uuidv4();
      const response = await openai.chat.completions.create({
        model: model,
        messages:messages,
        stream: true,
        temperature: 0.8,
        n :n
    });
   
        for await (const part of response){

          const data =part.choices[0]?.delta?.content;
          if (data) {
            res.write(data);
            generatedContent += data;
        }
           }
       

        // Send the generated content in the response
       // res.json({ generatedContent });

    } catch (error) {
        console.error('Error generating content:', error);
       // res.status(500).json({ error: 'Internal server error' });
    }
});



// Handle saving content to the database
app.post("/save-content", async (req, res) => {
   const data = req.body;
  
    try {
      // Save the received data to the database, including the unique ID
      const { writeTopic, uniqueId, streamingContent } = data;
      const content = new Content({
        writeTopic: writeTopic,
        // Other data...
        response:streamingContent,
        uniqueId: uniqueId,
        timestamp: new Date()
      });
      await content.save();
  
      // Respond with success or any other necessary data
      res.json({ success: true });
    } catch (error) {
      console.error('Error saving content:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  //handle the dashboard 

  // Handle fetching saved writetopics from the database
// app.get("/saved-writetopics", async (req, res) => {
//     try {
//       const writetopics = await Content.find({}, 'writeTopic'); // Assuming 'writeTopic' is the field name for writetopics
//       res.json(writetopics);
//     } catch (error) {
//       console.error('Error fetching saved writetopics:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

  app.get('/saved-writetopics', (req, res) => {
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
  
    const resultTopics = writeTopics.slice(startIndex, endIndex);
    res.json(resultTopics);
  });
  

  // Handle fetching response for a selected writetopic
  // app.post("/saved-content", async (req, res) => {
  //   const { writetopic } = req.body;
  //   console.log(writetopic);
  //   try {
  //     // Find the content associated with the selected writetopic
  //     const content = await Content.findOne({ writeTopic: writetopic });
  //     if (content) {
  //       console.log(content);
  //       res.json({ response: content.response });
  //     } else {
  //       res.status(404).json({ error: 'Response not found for the selected writetopic' });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching response for selected writetopic:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // });

  app.post("/saved-content", async (req, res) => {
    const { writetopic } = req.body;
    console.log(writetopic);
    try {
      // Find the content associated with the selected writetopic
      const content = await Content.findOne({ writeTopic: writetopic });
      if (content) {
        console.log(content);
        res.json({ response: content.response });
      } else {
        res.status(404).json({ error: 'Response not found for the selected writetopic' });
      }
    } catch (error) {
      console.error('Error fetching response for selected writetopic:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  

app.listen(9000, () => {
    console.log("Server is running on port 9000");
});
