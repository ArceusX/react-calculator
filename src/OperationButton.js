export default function OperationButton({ operation, dispatch }) {
  return (
    <button
      onClick={() =>
        dispatch({ action: 'choose-operation', value: { operation } })
      }
    >{operation}</button>
  )
}
