import React, { useEffect, useState } from 'react'
import Die from './Die'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'


function App() {

  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [numRoll, setNumRoll] = useState(0)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if(allHeld && allSameValue) {
      setTenzies(true)
    }
    
  }, [dice]) 
    
  useEffect(() => {
    let interValid = setInterval(() => {
      setTime(prev => prev + 1)
    },1000);

    if(tenzies){
      setTimeout(() => {
        clearInterval(interValid)
      });
    }

    return () => {
      clearInterval(interValid);
    }
  }, [tenzies])

  function generateNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()       
    }
  }

  function allNewDice () {
    const newDice = []
    for(let i = 0; i < 10; i++) {
      newDice.push(generateNewDice())
    }
    return newDice
  }

  function rollDice() {
    if(!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDice()
      }))
      setNumRoll(prevRoll => (prevRoll + 1))
    } else {
      setTenzies(false)
      setTime(0)
      setNumRoll(0)
      setDice(allNewDice())
    }
  }
  
  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        {...die, isHeld: !die.isHeld} :
        die
    }))
    
  }
   
  const diceElement = dice.map(die => (
    <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld} 
      holdDice={() => holdDice(die.id)}
    />
  )) 
   
  return (
    <main>
      {tenzies && <Confetti />}
      <div className='instruction-container'>
        <h1 className='title'>Tenzies</h1>
        <p><b>Timer: </b>{time} </p>
        <p className='instruction'>
          {tenzies ? `You won with ${numRoll} rolls!` : 
          "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."}
          </p>
      </div>
      <div className='dice-container'>
        {diceElement}
      </div>  
      <button 
        className='roll-dice' 
        onClick={rollDice}
      >
        {tenzies ? "New Game" : "Roll"}
        </button>
    </main>
  )
}

export default App
