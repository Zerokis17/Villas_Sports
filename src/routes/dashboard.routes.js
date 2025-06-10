import { Router } from 'express';
import User from '../models/user.model.js';
import Event from '../models/event.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const totalEventos = await Event.countDocuments();
    const totalUsuarios = await User.countDocuments();

    // Agrupar eventos por mes usando "fechaHora"
    const eventosPorMes = await Event.aggregate([
      {
        $group: {
          _id: { $month: '$fechaHora' },
          cantidad: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const meses = [
      '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const eventosPorMesTraducidos = eventosPorMes.map(e => ({
      mes: meses[e._id],
      cantidad: e.cantidad,
    }));

    res.json({
      totalEventos,
      totalUsuarios,
      eventosPorMes: eventosPorMesTraducidos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

export default router;
