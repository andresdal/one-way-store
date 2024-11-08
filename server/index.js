import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const client = new MercadoPagoConfig({ 
  accessToken: "APP_USR-4400229016053121-110721-f1abf1db6b0c0345eac75c10baf231fd-2082011433"
});

const preference = new Preference(client);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Soy el server");
});

app.post("/create_preference", async (req, res) => {
  const { items, back_urls, auto_return } = req.body;

  // Crear la preferencia de pago
  const body = {
    items: items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      currency_id: 'ARS', // Cambia según la moneda que uses
      unit_price: item.unit_price,
    })),
    back_urls,
    auto_return,
  };

  try {
    // Crea la preferencia usando la API de Mercado Pago
    const response = await preference.create({body});

    // Devuelve el ID de la preferencia al frontend
    res.json({ id: response.id });
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    res.status(500).json({ error: 'Hubo un error al crear la preferencia' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });