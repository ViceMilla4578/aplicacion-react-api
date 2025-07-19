export const SearchResults = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-600 p-4 mt-6">
        No hay resultados para mostrar. Realiza una búsqueda.
      </div>
    )
  }

  const getImageUrl = (digimon) => {
    if (digimon.images && digimon.images.length > 0) {
      return digimon.images[0].href
    }
    return `https://placehold.co/100x100/E0F2F7/000000?text=${encodeURIComponent(digimon.name.charAt(0))}`
  }

  const handleImageError = (event) => {
    event.target.onerror = null
    event.target.src = `https://placehold.co/100x100/E0F2F7/000000?text=No+Img`
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Resultados de la Búsqueda</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((digimon) => (
          <div key={digimon.id} className="bg-blue-50 p-4 rounded-lg shadow-md text-center flex flex-col items-center justify-between transform hover:scale-105 transition duration-300 ease-in-out">
            {digimon.id && <p className="text-xs text-gray-500 mb-1 font-mono">ID: {digimon.id}</p>}
            
            <div className="w-24 h-24 mb-3 relative overflow-hidden rounded-full border-4 border-blue-200 shadow-sm">
              <img
                src={getImageUrl(digimon)}
                alt={`Imagen de ${digimon.name}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 capitalize mb-3">{digimon.name}</h3>
            
            <div className="w-full text-sm text-gray-600 grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center p-1">
                <span className="font-bold text-gray-700 text-xs">Nivel: </span>
                <span className="capitalize">{digimon.levels?.[0]?.level || 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center p-1">
                <span className="font-bold text-gray-700 text-xs">Atributo: </span>
                <span className="capitalize">{digimon.attributes?.[0]?.attribute || 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center p-1">
                <span className="font-bold text-gray-700 text-xs">Tipo: </span>
                <span className="capitalize">{digimon.types?.[0]?.type || 'N/A'}</span>
              </div>
            </div>

            {digimon.fields && digimon.fields.length > 0 && (
              <div className="w-full mt-auto pt-2 border-t border-blue-200">
                <span className="font-bold text-gray-700 mb-2 block text-xs">Campos: </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {digimon.fields.map((field) => (
                    <div key={field.id} className="flex flex-col items-center" title={field.field}>
                      <img
                        src={field.image}
                        alt={`Campo ${field.field}`}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300"
                        onError={(e) => { e.target.style.display = 'none' }}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}