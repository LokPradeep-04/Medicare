const FilterTabs = ({ filters, activeFilter, onSelect }) => {
  return (
    <div className='flex gap-2 flex-wrap'>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onSelect(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            activeFilter === filter
              ? 'bg-teal-600 text-white border-teal-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs