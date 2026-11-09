
const Square = ({value, onClick}) => {
  return (
    <button onClick = {onClick} className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center text-5xl font-bold text-white hover:bg-gray-700 transition-colors">
        {value}
    </button>
  )
}

export default Square