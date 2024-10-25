import { Schema,model } from "mongoose";


const ReportSchema = new Schema({
    totalInspected: {
      type: Number,
      required: true
    },
    totalGood: {
      type: Number,
      required: true
    },
    totalDefective: {
      type: Number,
      required: true
    },
    reportDate: {
      type: Date,
      default: Date.now
    },
    generatedBy: {
      type: Schema.Types.ObjectId,  // Relacionado con el usuario que generó el reporte
      ref: 'User'
    }
  });
  
  const Report = model('Report', ReportSchema);
  export default Report;
  