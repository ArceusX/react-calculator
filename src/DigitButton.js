export default function DigitButton({ digit, dispatch }) {
  return (
    <button onClick={() => dispatch({ action: 'add-digit', value: { digit } })}>
      {digit}
    </button>
  )
}
