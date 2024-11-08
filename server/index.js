import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; 

dotenv.config();

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preference = new Preference(client);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public', express.static(path.join(__dirname, 'client/public')));

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'oneway'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL establecida.');
});

// Configuración para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../client/public/img_prod'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

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

app.post('/crear_producto', upload.any(), async (req, res) => {
  try {
    var { nombre, descripcion, peso, precio, precio_descuento, stockVariaciones } = req.body;
    const imagenes = req.files;

    descripcion = descripcion || null;
    peso = peso || null;
    precio = precio || null;
    precio_descuento = precio_descuento || null;

    // Paso 1: Insertar el producto en la base de datos
    const queryProducto = `INSERT INTO producto (nombre, descripcion, peso, precio, precio_descuento) VALUES (?, ?, ?, ?, ?)`;
    db.query(queryProducto, [nombre, descripcion, peso, precio, precio_descuento], async (err, result) => {
      if (err) {
        console.error('Error al crear el producto:', err);
        return res.status(500).json({ error: 'Error al crear el producto', details: err });
      }

      if (!result) {
        console.error('Error: resultado de la inserción del producto es undefined');
        return res.status(500).json({ error: 'Error al crear el producto' });
      }

      const productoId = result.insertId;

      // Paso 2: Insertar variaciones de producto (color y stock)
      const variaciones = JSON.parse(stockVariaciones);
      const variacionPromises = variaciones.map((variacion) => {
        const { tallaId, colorId, cantStock } = variacion;
        const queryVariacion = `INSERT INTO stock (producto_id, talla_id, color_id, cant_stock) VALUES (?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
          db.query(queryVariacion, [productoId, tallaId, colorId, cantStock], (err) => {
            if (err) {
              console.error('Error al crear la variación:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      // Paso 3: Insertar las imágenes asociadas a cada color
      const imagenPromises = imagenes.map((imagen) => {
        const colorId = imagen.fieldname.split('_')[1]; // Obtener el colorId del nombre del campo
        const queryImagen = `INSERT INTO imagen (producto_id, color_id, ruta_imagen) VALUES (?, ?, ?)`;
        return new Promise((resolve, reject) => {
          db.query(queryImagen, [productoId, colorId, imagen.path], (err) => {
            if (err) {
              console.error('Error al guardar las imágenes:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      // Esperar a que todas las promesas se resuelvan
      try {
        await Promise.all([...variacionPromises, ...imagenPromises]);
        res.status(200).json({ message: 'Producto creado exitosamente' });
      } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto', details: error });
      }
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud' });
  }
});


app.get('/producto/:id', (req, res) => {
  const productId = req.params.id;

  const query = `
    SELECT 
      p.id AS producto_id,
      p.nombre AS nombre,
      p.descripcion AS descripcion,
      p.peso AS peso,
      p.precio AS precio,
      p.precio_descuento AS precio_descuento,
      i.image_path AS imagen,
      t.nombre AS talla, 
      c.nombre AS color, 
      s.cant_stock
    FROM Stock s
    INNER JOIN Talla t ON s.id_talla = t.id
    INNER JOIN Color c ON s.id_color = c.id
    INNER JOIN Producto p ON s.id_producto = p.id
    INNER JOIN Imagen i ON p.id = i.id_producto
    WHERE s.id_producto = ?
  `;

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error al obtener stock:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
});

app.get('/productos', (req, res) => {
  const productId = req.params.id;

  const query = `
    SELECT 
      p.id AS id,
      p.nombre AS nombre,
      p.descripcion AS descripcion,
      p.peso AS peso,
      p.precio AS precio,
      p.precio_descuento AS precio_descuento,
      i.image_path AS imagen
    FROM Producto p
    JOIN Imagen i ON p.id = i.id_producto
  `;

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error al obtener los productos:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
});

// Ruta para agregar nueva talla
app.post('/agregar_talla', (req, res) => {
  const { nombre } = req.body;
  const query = 'INSERT INTO Talla (nombre) VALUES (?)';
  
  db.query(query, [nombre], (err, result) => {
    if (err) {
      console.error('Error al agregar la talla:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.status(200).json({ id: result.insertId, nombre });
    }
  });
});

// Ruta para agregar nuevo color
app.post('/agregar_color', (req, res) => {
  const { nombre } = req.body;
  const query = 'INSERT INTO Color (nombre) VALUES (?)';
  
  db.query(query, [nombre], (err, result) => {
    if (err) {
      console.error('Error al agregar el color:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.status(200).json({ id: result.insertId, nombre });
    }
  });
});

app.get("/tallas", (req, res) => {
  const query = 'SELECT * FROM Talla';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las tallas:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
} );

app.get("/colores", (req, res) => {
  const query = 'SELECT * FROM Color';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los colores:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
} );


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });