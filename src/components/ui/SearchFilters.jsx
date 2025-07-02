import React from 'react'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiSearch, FiFilter } = FiIcons

const SearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  sector, 
  setSector, 
  sortBy, 
  setSortBy 
}) => {
  const sectors = [
    'Food & Beverage',
    'Fitness & Health',
    'Retail',
    'Services',
    'Education',
    'Automotive',
    'Home Services',
    'Beauty & Wellness'
  ]

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'cost_low', label: 'Lowest Cost' },
    { value: 'cost_high', label: 'Highest Cost' },
    { value: 'profit', label: 'Highest Profit Margin' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <SafeIcon 
            icon={FiSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
          />
          <input
            type="text"
            placeholder="Search franchises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Sector Filter */}
        <div className="relative">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white"
          >
            <option value="">All Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <SafeIcon 
            icon={FiFilter} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" 
          />
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters