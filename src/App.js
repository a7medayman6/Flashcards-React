import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import FlashcardsList from './FlashcardsList';
import axios from 'axios'

function App() {

  //Constants
  const API_URL = 'https://opentdb.com/api.php?'
  const API_CATEGORY_URL = 'https://opentdb.com/api_category.php'
  
  // STATES 
  const [flashcards, setFlashcards] = useState( [] )
  const [categories, setCategories] = useState( [] )

  // REFS
  const categoryEL = useRef()
  const amountEl = useRef()


  // EFFECTS
  useEffect(() => 
  {
    axios
    .get(API_CATEGORY_URL)
    .then(res => 
      {
          setCategories(res.data.trivia_categories)
      })
  })

  // FUNCTIONS
  function decode(str)
  {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str

    return textArea.value
  }

  function generate(e)
  {
    e.preventDefault()
    axios
    .get(API_URL, 
      {
        params:
        {
          amount: amountEl.current.value,
          category: categoryEL.current.value
        }
      })
    .then(res => 
      {
          setFlashcards(res.data.results.map((item, index) => 
          {
            const answer = item.correct_answer
            const options = [
              ...item.incorrect_answers.map(str => decode(str)), 
              answer]
            return{
              id: `${index}-${Date.now}`,
              question: decode(item.question),
              answer: decode(answer),
              options: options.sort(() => Math.random() - .5)
            };
          }))
          
      })
  }

  return (
    <>

      <form className="header" onSubmit={generate}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEL}>
            {
              categories.map(category => 
                {
                  return <option value={category.id} key={category.id}> {category.name} </option>
                })
              }
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Number of questions</label>
          <input type="number" id="amount" min="1" max="50" step="1" defaultValue="10" ref={amountEl}/>  
        </div>
        
        <div className="form-group">
          <button className="btn">Generate</button> 
        </div>
      </form>


      <div className="flashcards-container">
        <FlashcardsList flashcards={flashcards}/>   
      </div>
    </>
  );
}
const sample_questions = [
  {
    id: 1, 
    question: 'Q1 ?',
    answer: 'A',
    options: 
    ['A', 'B', 'C', 'D']
  },
  {
    id: 2, 
    question: 'Q2 ?',
    answer: 'A',
    options: 
    ['A', 'B', 'C', 'D']
  },
  {
    id: 3, 
    question: 'Q3 ?',
    answer: 'A',
    options: 
    ['A', 'B', 'C', 'D']
  }
]

export default App;
