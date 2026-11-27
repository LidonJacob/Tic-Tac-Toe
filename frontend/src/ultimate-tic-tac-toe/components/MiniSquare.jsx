const MiniSquare = ({ value, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="aspect-square bg-gray-900
    border border-gray-700 rounded-md text-2xl sm:text-3xl font-bold text-cyan-400 hover:bg-gray-800
    disabled:cursor-not-allowed transition-colors"
    >
      {value}
    </button>
  );
};

export default MiniSquare;
