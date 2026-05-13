import { useState } from 'react';
import toast from 'react-hot-toast';
import ProductCatalog from './ProductCatalog';
import BillPanel from './BillPanel';

function Dashboard({ user, onLogout }) {
  const [billItems, setBillItems] = useState([]);

  const handleAddToBill = (item) => {
    setBillItems(prevItems => {
      // Check if item already exists
      const existingIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingIndex >= 0) {
        // Update quantity if exists
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += 1;
        updatedItems[existingIndex].item_total = updatedItems[existingIndex].unit_price * updatedItems[existingIndex].quantity;
        toast.success(`Updated ${item.name} quantity`);
        return updatedItems;
      } else {
        // Add new item
        toast.success(`${item.name} added to bill`);
        return [...prevItems, item];
      }
    });
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (isNaN(newQuantity) || newQuantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    
    setBillItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = newQuantity;
      updatedItems[index].item_total = updatedItems[index].unit_price * newQuantity;
      return updatedItems;
    });
  };

  const handleRemoveItem = (index) => {
    setBillItems(prevItems => {
      const removedItem = prevItems[index];
      toast.success(`${removedItem.name} removed from bill`);
      return prevItems.filter((_, i) => i !== index);
    });
  };

  const handleNewBill = () => {
    if (billItems.length > 0) {
      if (window.confirm('Start a new bill? Current bill will be cleared.')) {
        setBillItems([]);
        toast.success('New bill started');
      }
    } else {
      toast('Bill is already empty');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🛒 POS Billing System</h1>
            <p className="text-sm text-gray-600">Welcome, {user.username}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleNewBill}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium"
            >
              🆕 New Bill
            </button>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Product Catalog */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
              <h2 className="text-xl font-semibold">📦 Product Catalog</h2>
              <p className="text-sm text-blue-100">Click on any product to add to bill</p>
            </div>
            <ProductCatalog onAddToBill={handleAddToBill} />
          </div>

          {/* Right Column - Current Bill */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3">
              <h2 className="text-xl font-semibold">🧾 Current Bill</h2>
              <p className="text-sm text-green-100">{billItems.length} item{billItems.length !== 1 ? 's' : ''} in bill</p>
            </div>
            <BillPanel 
              items={billItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onNewBill={handleNewBill}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;