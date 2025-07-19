export const DatalocalStorage = ({ savedData }) => {
  if (!savedData || savedData.length === 0) {
    return (
      <div className="text-center text-gray-600 p-4">
        No hay datos guardados en LocalStorage.
      </div>
    )
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha no válida'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Búsquedas Guardadas ({savedData.length})
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Término de Búsqueda
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Resultados Encontrados
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Fecha de Búsqueda
              </th>
            </tr>
          </thead>
          <tbody>
            {savedData.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="py-3 px-4 text-gray-700 font-medium">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {item.searchTerm}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  <div className="max-w-xs truncate">
                    {item.results && item.results.length > 0
                      ? item.results.map(res => res.name).join(', ')
                      : 'Sin resultados'
                    }
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {item.results ? item.results.length : 0}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-sm">
                  {item.timestamp ? formatDate(item.timestamp) : 'Sin fecha'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {savedData.length >= 10 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          * Solo se muestran las últimas 10 búsquedas
        </div>
      )}
    </div>
  )
}