function Button({ children }) {
  return (
    <button
      className="bg-[#1D4533] text-white px-5 py-3 rounded-lg font-medium hover:opacity-90 transition"
    >
      {children}
    </button>
  )
}

export default Button