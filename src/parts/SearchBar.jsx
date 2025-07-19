import React, { useState } from 'react'

export const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchClick = () => {
    onSearch(searchTerm)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md mb-6 w-full max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Buscar Digimon (ej. Agumon)"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto"
      />
      <button
        onClick={handleSearchClick}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out w-full sm:w-auto"
      >
        Buscar
      </button>
    </div>
  )
}