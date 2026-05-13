import { useState } from 'react';
import toast from 'react-hot-toast';

function BillPanel({ items, onUpdateQuantity, onRemoveItem, onNewBill }) {
  const [discountType, setDiscountType] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.item_total, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.15; // 15% tax
  };

  const calculateDiscount = (subtotal) => {
    if (!discountType || discountValue <= 0) return 0;
    
    if (discountType === 'flat') {
      return Math.min(discountValue, subtotal);
    } else if (discountType === 'percentage') {
      const discountAmount = subtotal * (discountValue / 100);
      return Math.min(discountAmount, subtotal);
    }
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const tax = calculateTax(subtotal - discount);
    return subtotal - discount + tax;
  };

  const getImageUrl = (imagePath) => {
    if (imagePath && imagePath !== '/images/products/.jpg' && imagePath !== 'null') {
      return `http://localhost:5000${imagePath}`;
    }
    return '/images/placeholder.png';
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
        </svg>
        <p className="mt-4 text-gray-500 font-medium">Your bill is empty</p>
        <p className="text-sm text-gray-400 mt-1">Click on products from the catalog to add items</p>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const tax = calculateTax(subtotal - discount);
  const total = calculateTotal();

  return (
    <div className="p-4">
      {/* Bill Items List */}
      <div className="max-h-[350px] overflow-y-auto mb-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex items-center gap-3">
              <img
                src={getImageUrl(item.image_path)}
                alt={item.name}
                className="w-14 h-14 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder.png';
                }}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <p className="text-xs text-gray-500">LKR {item.unit_price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border rounded text-center"
                  min="1"
                />
                <button
                  onClick={() => onRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 font-bold px-2"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="text-right mt-2">
              <span className="font-semibold text-green-600">
                LKR {item.item_total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Discount Section */}
      <div className="border-t pt-4 mb-4">
        <div className="bg-yellow-50 rounded-lg p-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Apply Discount
          </label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => {
                setDiscountType('flat');
                setDiscountValue(0);
              }}
              className={`flex-1 px-3 py-1 rounded text-sm font-medium transition ${
                discountType === 'flat' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Flat (LKR)
            </button>
            <button
              onClick={() => {
                setDiscountType('percentage');
                setDiscountValue(0);
              }}
              className={`flex-1 px-3 py-1 rounded text-sm font-medium transition ${
                discountType === 'percentage' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Percentage (%)
            </button>
            {discountType && (
              <button
                onClick={() => {
                  setDiscountType(null);
                  setDiscountValue(0);
                }}
                className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
              >
                Clear
              </button>
            )}
          </div>
          
          {discountType && (
            <input
              type="number"
              placeholder={discountType === 'flat' ? 'Enter amount in LKR' : 'Enter percentage (1-100)'}
              className="w-full px-3 py-2 border rounded-lg"
              value={discountValue}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                if (isNaN(value)) value = 0;
                if (discountType === 'percentage' && value > 100) value = 100;
                if (value < 0) value = 0;
                setDiscountValue(value);
              }}
              min="0"
              max={discountType === 'percentage' ? 100 : undefined}
            />
          )}
        </div>
      </div>

      {/* Totals Section */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({discountType === 'flat' ? `LKR ${discountValue}` : `${discountValue}%`}):</span>
            <span>- LKR {discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Tax (15%):</span>
          <span>LKR {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
          <span>Total:</span>
          <span className="text-green-600">LKR {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={onNewBill}
          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition font-medium"
        >
          Clear Bill
        </button>
        <button
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
          onClick={() => toast.success('Invoice feature coming soon!')}
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
}

export default BillPanel;