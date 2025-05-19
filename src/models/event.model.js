import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  nombreEvento: {
    type: String,
    required: true
  },
  tipoEvento: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  hora: {
    type: Date,
    required: true
  },
  fecha: {
    type: Date, 
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Event', eventSchema);
