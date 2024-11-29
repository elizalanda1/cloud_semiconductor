import { Schema,model } from "mongoose";

const CircuitSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    inspectionResult: {
      type: String,
      enum: ['Good', 'Defective'],
      default: 'Pending'  // Result of inspection
    },
    inspectionDate: {
      type: Date,
      default: Date.now
    },
    processedBy: {
      type: Schema.Types.ObjectId,  // Relacionado con el usuario que realizó la inspección
      ref: 'User'
    },
    additionalInfo: {
      type: String
    }
  });
  
  const Circuit = model('Circuit', CircuitSchema);
  export default Circuit;
  