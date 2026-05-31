import {useState, useRef, useEffect, useReducer, useContext} from "react"

/*

useState is a React hook that allows you to add state to functional components. 
It returns an array with two elements: the current 'state' value and a 'function to update that state'.

useRef is a React hook that provides a way to access and manipulate DOM elements directly. 
It returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). 
The ref object can be used to store a reference to a DOM element or any mutable value that persists across renders.

useEffect is a React hook that allows you to perform side effects in functional components. 
It takes a function as an argument and runs that function after the component renders. 
You can also specify dependencies for the effect, so it only runs when those dependencies change.

useReducer is a React hook that is used for managing complex state logic in functional components. 

*/

export function CleanSheet(){
  const [answer, setAnswear] = useState<"Yes" | "No">("Yes")

  const [thought, setThought] = useState<string>("")
  // esto no es necesario porque lo manejas con thought
  // ademas useRef deberia usarse para acceder a elementos del DOM, no para manejar el estado de un input
  // ejemplo Focus, scroll, etc. No para limpiar el valor de un input, eso se hace con el estado
  //const cleanButtonRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (thought.length > 0) {
      console.log("Thought updated:", thought)
    }
  }, [thought])
  
 function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
   setThought(event.target.value)
  }

  function handleCleanButton() {
    setThought("")
    /*if (cleanButtonRef.current) {
      cleanButtonRef.current.value = ""
    }*/
  }

  function toggleAnswer() {
    setAnswear(answer === "Yes" ? "No" : "Yes")
  }

  /******************************************* */

  const initialState = {count : 0};

  type typeState = {
    count: number
  }

  type typeAction = { 
    type: "increment" | "decrement" | "reset",
    payload: number
  }

  function reducer(state: typeState, action: typeAction) {
    switch (action.type) {
      case "increment":
        return{count : state.count + action.payload};
      case "decrement":
        return{count : state.count - action.payload};
      case "reset":
        return{count : 0};
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  function increment() {
    console.log(state)
    dispatch({type: "increment", payload: 1})
  }

  function decrement() {
    console.log(state)
    dispatch({type: "decrement", payload: 1})
  }

  function reset() {
    console.log(state)
    dispatch({type: "reset", payload: 0})
  }

  return (
    <>
      <button onClick={toggleAnswer}>Toggle Test</button>
      <p>Current answer: {answer}</p>
      <br/>
      <p id="test-p">{thought}</p>
      <br/>
      <input id="typeDownInput" type="text" onChange={handleChangeInput} /*ref={cleanButtonRef}*/ value={thought}/>
      <button id="cleanButton" type="button" onClick={handleCleanButton} >
        Clean
      </button>
      <br/>
      <p>Reducer example:</p>
      <p>Count: {state.count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </>
  )
}