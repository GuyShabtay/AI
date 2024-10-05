import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import DialogWorkflow from './DialogWorkflow/DialogWorkflow'

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer... \n It might take up to 10 seconds");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  return (
    // <div className="bg-gradient">
    //   <form onSubmit={generateAnswer} className="form-container">
      
    //       <h1 className="form-heading">Echo AI</h1>
      
    //     <textarea
    //       required
    //       className="textarea"
    //       value={question}
    //       onChange={(e) => setQuestion(e.target.value)}
    //       placeholder="Ask anything"
    //     ></textarea>
    //     <button
    //       type="submit"
    //       className={`button ${generatingAnswer ? "disabled" : ""}`}
    //       disabled={generatingAnswer}
    //     >
    //       Generate answer
    //     </button>
    //   </form>
    //   <div className="answer-container">
    //     <ReactMarkdown className="p-4">{answer}</ReactMarkdown>
    //   </div>
    // </div>
    <div>
    <DialogWorkflow/>
    </div>
  );
}

export default App;
