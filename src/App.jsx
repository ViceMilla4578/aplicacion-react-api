import React, { useState, useEffect, useCallback } from 'react'
import { SearchBar } from './parts/SearchBar'
import { SearchResults } from './parts/SearchResults'
import { DatalocalStorage } from './parts/DatalocalStorage'

export const App = () => {
  const [searchResults, setSearchResults] = useState([])
  const [savedSearches, setSavedSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('digimonSearches')
      if (storedData) {
        setSavedSearches(JSON.parse(storedData))
      }
    } catch (e) {
      console.error("Error al cargar datos de LocalStorage:", e)
      setError("Error al cargar búsquedas guardadas.")
    }
  }, [])

  const saveSearch = useCallback((searchTerm, results) => {
    const newEntry = { searchTerm, results, timestamp: new Date().toISOString() }
    setSavedSearches(prevSearches => {
      const updatedSearches = [newEntry, ...prevSearches].slice(0, 10) // Limita a 10 búsquedas
      try {
        localStorage.setItem('digimonSearches', JSON.stringify(updatedSearches))
      } catch (e) {
        console.error("Error al guardar en LocalStorage:", e)
      }
      return updatedSearches
    })
  }, [])

  const handleSearch = useCallback(async (searchTerm) => {
    setSearchResults([])
    setError(null)

    if (!searchTerm.trim()) {
      setLoading(false)
      return
    }
    
    setLoading(true)

    try {
      const listResponse = await fetch(`https://digi-api.com/api/v1/digimon?name=${encodeURIComponent(searchTerm)}`)
      
      if (!listResponse.ok) {
        if (listResponse.status === 404) {
          setError(`No se encontraron Digimon con el nombre "${searchTerm}".`)
        } else {
          throw new Error(`Error HTTP! Estado: ${listResponse.status}`)
        }
        setSearchResults([])
      } else {
        const listData = await listResponse.json()
        if (listData.content && listData.content.length > 0) {
          const detailPromises = listData.content.map(digimon =>
            fetch(digimon.href).then(res => {
              if (!res.ok) {
                console.warn(`No se pudieron obtener detalles para ${digimon.name}`)
                return null
              }
              return res.json()
            })
          )

          const detailedResults = (await Promise.all(detailPromises)).filter(Boolean) 

          if (detailedResults.length > 0) {
            setSearchResults(detailedResults)
            saveSearch(searchTerm, detailedResults)
          } else {
             setError(`Se encontraron resultados para "${searchTerm}", pero no se pudieron cargar sus detalles.`)
          }

        } else {
          setSearchResults([])
          setError(`No se encontraron Digimon con el nombre "${searchTerm}".`)
        }
      }
    } catch (e) {
      console.error("Error al obtener datos de la API de Digimon:", e)
      setError("Error al buscar Digimon. Intenta de nuevo.")
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }, [saveSearch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 font-sans">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400600700&display=swap') body { font-family: 'Inter', sans-serif }`}
      </style>
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Buscador de Digimon</h1>
        <p className="text-lg text-gray-700">Explora y guarda tus Digimon favoritos.</p>
      </header>

      <main className="container mx-auto px-4">
        <SearchBar onSearch={handleSearch} />

        {loading && (
          <div className="text-center text-blue-600 text-lg font-semibold my-4">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando detalles...
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 text-lg font-semibold my-4 p-3 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        {!loading && !error && searchResults.length > 0 && <SearchResults results={searchResults} />}
        
        <DatalocalStorage savedData={savedSearches} />
      </main>

      <footer className="text-center py-6 text-gray-600 text-sm">
        <p>&copy Aplicación de Búsqueda de Digimon usando API y Desarrollado con React. INACAP 2025.</p>
      </footer>
    </div>
  )
}