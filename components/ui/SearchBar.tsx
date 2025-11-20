export default function SearchBar() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-tansy-pink to-tansy-pink-dark rounded-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 border border-white rounded-sm"></div>
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="How can I help you today?"
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-tansy-gray bg-white text-tansy-gray-darker placeholder-tansy-gray-dark focus:outline-none focus:border-tansy-teal transition-colors"
        />
      </div>
    </div>
  )
}

