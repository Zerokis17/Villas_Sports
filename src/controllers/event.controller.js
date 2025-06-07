import Event from "../models/event.model.js";
import User from "../models/user.model.js";

export const getEvents = async (req, res) => {
  try {
    const { tipoEvento, username } = req.query;

    let query = {};

    if (tipoEvento) {
      const eventos = await Event.find({
        tipoEvento: { $regex: tipoEvento, $options: "i" },
      });
      if (eventos.length === 0) {
        return res
          .status(404)
          .json({ message: "Tipo de evento no encontrado" });
      }
      query.tipoEvento = { $regex: tipoEvento, $options: "i" };
    }

    if (username) {
      const users = await User.find({
        username: { $regex: username, $options: "i" },
      });
      if (users.length === 0) {
        return res.status(404).json({ message: "Usuarios no encontrados" });
      }
      const userIds = users.map((user) => user._id);
      query.user = { $in: userIds };
    }

    const events = await Event.find(query).populate("user");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar los eventos", error });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { nombreEvento, tipoEvento, ubicacion, fechaHora } = req.body;

    const newEvent = new Event({
      nombreEvento,
      tipoEvento,
      ubicacion,
      fechaHora,
      user: req.user.id,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el evento", error });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("user");
    if (!event)
      return res.status(404).json({ message: "Evento no encontrado" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el evento", error });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).populate("user");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tus eventos", error });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(204).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).json({ message: "Error al eliminar el evento", error });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Evento no encontrado" });

    if (event.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar este evento" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el evento", error });
  }
};
