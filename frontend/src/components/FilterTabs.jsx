const FilterTabs = ({ filters, activeFilter, onSelect }) => {
  return (
    <div className='flex gap-2 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-nowrap'>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onSelect(filter)}
          className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
            activeFilter === filter
              ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-100'
              : 'bg-white text-gray-600 border-gray-100 hover:border-teal-400 hover:bg-teal-50'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs