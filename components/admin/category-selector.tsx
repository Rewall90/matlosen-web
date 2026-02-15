'use client'

import { useState, useEffect, useRef } from 'react'
import { searchCategories, type Category } from '@/lib/api/products'

type Props = {
  value: string | null
  onChange: (categoryId: string | null) => void
  initialCategoryName?: string | null
}

export function CategorySelector({ value, onChange, initialCategoryName }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedName, setSelectedName] = useState<string | null>(initialCategoryName ?? null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchCategories(query)
        setResults(data)
      } catch (err) {
        console.error('Failed to search categories:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  function handleSelect(category: Category) {
    setSelectedName(category.name_no)
    onChange(category.id)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  function handleClear() {
    setSelectedName(null)
    onChange(null)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-text-secondary mb-2">
        Category
      </label>

      {value && selectedName ? (
        <div className="flex items-center justify-between px-4 py-2 border border-border rounded-lg bg-surface">
          <div>
            <span className="text-text-primary">{selectedName}</span>
            <span className="text-xs text-text-muted ml-2">({value})</span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-text-muted hover:text-text-primary ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search categories..."
            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {isOpen && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-surface-elevated border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat)}
              className="w-full px-4 py-2 text-left hover:bg-surface-muted transition-colors"
            >
              <span className="text-text-primary">{cat.name_no}</span>
              <span className="text-xs text-text-muted ml-2">{cat.id}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-surface-elevated border border-border rounded-lg shadow-lg p-4 text-center text-text-muted">
          No categories found
        </div>
      )}
    </div>
  )
}
