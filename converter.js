import React, { useState, useMemo } from 'react';
import { Search, X, ChevronDown, AlertCircle } from 'lucide-react';

// Temporary food database (in a real app, this would be loaded from the JSON file that Im parsing from the XML files)
const FOOD_DATABASE = [
  { id: 1, name: "Apple, raw", portion: "1 medium (3\" dia)", calories: 95 },
  { id: 2, name: "Banana, raw", portion: "1 medium (7-8\" long)", calories: 105 },
  { id: 3, name: "Orange, raw", portion: "1 medium (2-5/8\" dia)", calories: 62 },
  { id: 4, name: "Grapes, raw", portion: "1 cup", calories: 104 },
  { id: 5, name: "Strawberries, raw", portion: "1 cup, halves", calories: 49 },
  { id: 6, name: "Chicken breast, grilled", portion: "3 oz", calories: 165 },
  { id: 7, name: "Chicken thigh, grilled", portion: "3 oz", calories: 180 },
  { id: 8, name: "Ground beef, 85% lean", portion: "3 oz", calories: 213 },
  { id: 9, name: "Ground beef, 95% lean", portion: "3 oz", calories: 164 },
  { id: 10, name: "Salmon, Atlantic, wild", portion: "3 oz", calories: 175 },
  { id: 11, name: "Tuna, light, canned in water", portion: "3 oz", calories: 99 },
  { id: 12, name: "Egg, whole, cooked", portion: "1 large", calories: 78 },
  { id: 13, name: "Milk, 2% fat", portion: "1 cup", calories: 122 },
  { id: 14, name: "Milk, skim", portion: "1 cup", calories: 83 },
  { id: 15, name: "Yogurt, plain, low-fat", portion: "1 cup", calories: 154 },
  { id: 16, name: "Cheese, cheddar", portion: "1 oz", calories: 114 },
  { id: 17, name: "Bread, whole wheat", portion: "1 slice", calories: 81 },
  { id: 18, name: "Bread, white", portion: "1 slice", calories: 79 },
  { id: 19, name: "Rice, white, cooked", portion: "1 cup", calories: 205 },
  { id: 20, name: "Rice, brown, cooked", portion: "1 cup", calories: 216 },
  { id: 21, name: "Pasta, cooked", portion: "1 cup", calories: 221 },
  { id: 22, name: "Oatmeal, cooked", portion: "1 cup", calories: 166 },
  { id: 23, name: "Potato, baked with skin", portion: "1 medium", calories: 161 },
  { id: 24, name: "Sweet potato, baked", portion: "1 medium", calories: 103 },
  { id: 25, name: "Broccoli, cooked", portion: "1 cup", calories: 55 },
  { id: 26, name: "Carrots, raw", portion: "1 medium", calories: 25 },
  { id: 27, name: "Spinach, raw", portion: "1 cup", calories: 7 },
  { id: 28, name: "Tomato, raw", portion: "1 medium", calories: 22 },
  { id: 29, name: "Avocado, raw", portion: "1/2 fruit", calories: 160 },
  { id: 30, name: "Almonds, raw", portion: "1 oz (23 nuts)", calories: 164 },
  { id: 31, name: "Peanut butter", portion: "2 tbsp", calories: 188 },
  { id: 32, name: "Olive oil", portion: "1 tbsp", calories: 119 },
  { id: 33, name: "Butter", portion: "1 tbsp", calories: 102 },
  { id: 34, name: "Pizza, cheese", portion: "1 slice", calories: 285 },
  { id: 35, name: "Hamburger, fast food", portion: "1 sandwich", calories: 354 },
  { id: 36, name: "French fries", portion: "1 medium order", calories: 365 },
  { id: 37, name: "Soda, cola", portion: "12 fl oz", calories: 136 },
  { id: 38, name: "Coffee, black", portion: "8 fl oz", calories: 2 },
  { id: 39, name: "Orange juice", portion: "8 fl oz", calories: 112 },
  { id: 40, name: "Ice cream, vanilla", portion: "1/2 cup", calories: 137 },
  { id: 41, name: "Chocolate chip cookie", portion: "1 medium", calories: 78 },
  { id: 42, name: "Apple pie", portion: "1 slice", calories: 296 },
  { id: 43, name: "Steak, sirloin", portion: "3 oz", calories: 180 },
  { id: 44, name: "Pork chop, grilled", portion: "3 oz", calories: 197 },
  { id: 45, name: "Shrimp, cooked", portion: "3 oz", calories: 84 },
  { id: 46, name: "Tofu, firm", portion: "1/2 cup", calories: 94 },
  { id: 47, name: "Black beans, cooked", portion: "1 cup", calories: 227 },
  { id: 48, name: "Lentils, cooked", portion: "1 cup", calories: 230 },
  { id: 49, name: "Quinoa, cooked", portion: "1 cup", calories: 222 },
  { id: 50, name: "Blueberries, raw", portion: "1 cup", calories: 84 }
];

export default function CalorieCounter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [warning, setWarning] = useState('');
  const [displayLimit, setDisplayLimit] = useState(25);

  // Create a search index for faster lookups (bonus feature)
  const searchIndex = useMemo(() => {
    const index = new Map();
    FOOD_DATABASE.forEach(food => {
      const words = food.name.toLowerCase().split(/[\s,]+/);
      words.forEach(word => {
        if (!index.has(word)) {
          index.set(word, []);
        }
        index.get(word).push(food);
      });
    });
    return index;
  }, []);

  const handleSearch = () => {
    // Check if search term is empty
    if (!searchTerm.trim()) {
      setWarning('Please enter a search term');
      setResults([]);
      return;
    }

    setWarning('');
    
    // Process search term (support wildcard with *)
    const term = searchTerm.toLowerCase().trim();
    const isWildcard = term.includes('*');
    
    let matched;
    
    if (isWildcard) {
      // Wildcard search (bonus feature)
      const pattern = term.replace(/\*/g, '.*');
      const regex = new RegExp(pattern, 'i');
      matched = FOOD_DATABASE.filter(food => regex.test(food.name));
    } else {
      // Regular search - matches any food containing the search term
      matched = FOOD_DATABASE.filter(food => 
        food.name.toLowerCase().includes(term)
      );
    }

    if (matched.length === 0) {
      setWarning('No matching foods found');
      setResults([]);
    } else {
      setResults(matched);
      setDisplayLimit(25); // Reset display limit on new search
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
    setWarning('');
    setDisplayLimit(25);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const loadMore = () => {
    setDisplayLimit(prev => prev + 25);
  };

  const displayedResults = results.slice(0, displayLimit);
  const hasMore = results.length > displayLimit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Calorie Counter
            </h1>
            <p className="text-gray-600">
              Search for foods to find their calorie content
            </p>
          </div>

          {/* Search Panel */}
          <div className="mb-6">
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter food name (e.g., apple, chicken, *berry)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
              >
                <Search size={20} />
                Search
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 font-semibold"
              >
                <X size={20} />
                Clear
              </button>
            </div>
            
            {/* Tips */}
            <p className="text-sm text-gray-500">
              💡 Tip: Use * as a wildcard (e.g., "*berry" for strawberries, blueberries)
            </p>
          </div>

          {/* Warning Messages */}
          {warning && (
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded flex items-start gap-3">
              <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
              <p className="text-yellow-800">{warning}</p>
            </div>
          )}

          {/* Results Count (bonus feature) */}
          {results.length > 0 && (
            <div className="mb-3 text-sm font-semibold text-gray-700">
              Found {results.length} matching food{results.length !== 1 ? 's' : ''}
              {results.length > 25 && ` (showing ${displayedResults.length})`}
            </div>
          )}

          {/* Results Panel */}
          {results.length > 0 && (
            <div>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Food Description
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Portion Size
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          Calories
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedResults.map((food) => (
                        <tr key={food.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-800">{food.name}</td>
                          <td className="px-4 py-3 text-gray-600">{food.portion}</td>
                          <td className="px-4 py-3 text-right font-semibold text-green-700">
                            {food.calories}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Load More Button (bonus feature) */}
              {hasMore && (
                <button
                  onClick={loadMore}
                  className="w-full mt-3 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <ChevronDown size={20} />
                  Load More Results ({results.length - displayLimit} remaining)
                </button>
              )}
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && !warning && (
            <div className="text-center py-12 text-gray-400">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Search for a food to get started</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Note: In a production app, food data would be loaded from the USDA MyPyramid database
          </p>
        </div>
      </div>
    </div>
  );
}
