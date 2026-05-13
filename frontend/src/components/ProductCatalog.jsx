import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function ProductCatalog({ onAddToBill }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products/search?q=${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      fetchProducts();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchProducts();
    }
  };

  const getImageUrl = (imagePath) => {
    if (imagePath && imagePath !== '/images/products/.jpg' && imagePath !== 'null') {
      return `http://localhost:5000${imagePath}`;
    }
    return '/images/placeholder.png';
  };

  const handleAddToCart = (product) => {
    const item = {
      id: product.id,
      product_id: product.product_id,
      name: product.name,
      unit_price: product.unit_price,
      quantity: 1,
      image_path: product.image_path,
      item_total: product.unit_price
    };
    onAddToBill(item);
    toast.success(`${product.name} added to bill`);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-3 text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search by name or product ID..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
            value={searchTerm}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={searchProducts}
            className="absolute right-1 top-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition text-sm"
          >
            Search
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-gray-500">No products found</p>
            <p className="text-sm text-gray-400">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-3 hover:shadow-lg transition-all cursor-pointer bg-white hover:bg-gray-50"
                onClick={() => handleAddToCart(product)}
              >
                <div className="flex items-center gap-3">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(product.image_path)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">ID: {product.product_id}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xl font-bold text-green-600">
                        LKR {product.unit_price.toFixed(2)}
                      </p>
                      <button
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Bill
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Count */}
      <div className="mt-4 pt-3 border-t text-center text-sm text-gray-500">
        {products.length} product{products.length !== 1 ? 's' : ''} available
      </div>
    </div>
  );
}

export default ProductCatalog;