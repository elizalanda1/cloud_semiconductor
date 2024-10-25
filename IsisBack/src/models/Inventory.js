import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  name: {
    type: String,  // El nombre del circuito
    required: true
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  goodQuantity: {
    type: Number,
    required: true
  },
  defectiveQuantity: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Inventory = mongoose.model('Inventory', InventorySchema);
export default Inventory;
