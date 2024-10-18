import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import Footer from "./Footer"
import "./styles.css"

function reducer(state, { action, value }) {
  switch (action) {
    case 'clear-all': return {}
    case 'add-digit':
      // Put digit in empty currentOperand; set newExpr as false so
      // next 'clear-digit' clears 1 digit, rather than full line
      if (state.newExpr) {
        return {
          ...state,
          currentOperand: value.digit,
          newExpr: false,
        }
      }
      
      // If append 0 to 0 or . to term that already has .: do nothing
      if (value.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (value.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${value.digit}`,
      }

    case 'choose-operation':
      // Set operation
      if (state.currentOperand == null && state.previousOperand != null) {
        return {
          ...state,
          operation: value.operation,
        }
      }

      if (state.currentOperand != null) {
        // If have both operands, evaluate existing. For either case, set
        // what we have as previousOperand and wait for new currentOperand
        if (state.previousOperand != null) {
          return {
            currentOperand: null,
            previousOperand: evaluate(state),
            operation: value.operation,
          }
        }
        else {
          return {
            currentOperand: null,
            previousOperand: state.currentOperand,
            operation: value.operation
          }
        }
      }
      break;

    case 'clear-digit':
      // Whether clear (newExpr, .length === 1) or do nothing, currentOperand to be null
      if (state.newExpr ||
          state.currentOperand == null ||
          state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }

    case 'evaluate':
      if (state.operation != null || state.currentOperand != null) {
        // Set result as currentOperand; clear previousOperand, operation
        // Set newExpr to true so that subsequent 'clear-digit' operation
        // knows to clear entire result rather than only 1 digit
        return {
          newExpr: true,
          currentOperand: evaluate(state),
          previousOperand: null,
          operation: null,
        }
      }
      break;

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev    = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let result = ""
  switch (operation) {
    case "+":
      result = prev + current
      break
    case "-":
      result = prev - current
      break
    case "*":
      result = prev * current
      break
    case "÷":
      result = prev / current
      break
    default:
  }
  return result.toString()
}

// Adds , after every 3 digits in integer part.
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

// maximumFractionDigits: 0 as we'll resolve integer.fraction ourself by string split
function formatNumber(number) {
  if (number == null) return
  const [integer, decimal] = number.split(".")
  let intPart = INTEGER_FORMATTER.format(integer);
  return (decimal == null) ? intPart : `${intPart}.${decimal}`
}

function App() {
  // dispatch(..) is attached to onClick and passes { action, value }
  // to reducer to update such output values for state
  const [{ currentOperand, previousOperand, operation}, dispatch] = useReducer(
    reducer, {})

  return (
    <div className="page-container">
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatNumber(previousOperand)} {operation}
          </div>
          <div className="current-operand">{formatNumber(currentOperand)}</div>
        </div>
        <button className="span-two"
          onClick={() => dispatch({ action: 'clear-all' })}>AC</button>
        <button 
          onClick={() => dispatch({ action: 'clear-digit' })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two"
          onClick={() => dispatch({ action: 'evaluate' })}>=</button>
      </div>
      <Footer />
    </div>
  )
}

export default App
