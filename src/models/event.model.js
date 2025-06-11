const eventSchema = new mongoose.Schema(
  {
    nombreEvento: {
      type: String,
      required: true,
    },
    tipoEvento: {
      type: String,
      required: true,
    },
    ubicacion: {
      type: String,
      required: true,
    },
    fechaHora: {
      type: Date,
      required: true,
    },
    descripcion: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);