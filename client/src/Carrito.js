import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Paper, InputBase, Button, Grid } from '@mui/material';
import { Add, Remove } from '@mui/icons-material'
import { Wallet } from '@mercadopago/sdk-react';

const Carrito = ({ carrito, setCarrito }) => {
  const [preferenceId, setPreferenceId] = useState(null);

  const removerDelCarrito = (producto) => {
    const carritoActualizado = carrito.filter(
      (item) => !(item.id === producto.id && item.talla === producto.talla)
    );
    setCarrito(carritoActualizado);
  }

  const reducirCantidad = (producto) => {
      const productoExistente = carrito.find(
          (item) => item.id === producto.id && item.talla === producto.talla
        );
    
        if (productoExistente.cantidad > 1) {
          // Si el producto tiene más de una unidad, disminuye la cantidad
          const carritoActualizado = carrito.map((item) =>
            item.id === producto.id && item.talla === producto.talla
              ? { ...item, cantidad: item.cantidad - 1 }
              : item
          );
          setCarrito(carritoActualizado);
        } else {
          // Si solo queda una unidad, elimina el producto del carrito
          const carritoActualizado = carrito.filter(
            (item) => !(item.id === producto.id && item.talla === producto.talla)
          );
          setCarrito(carritoActualizado);
        }
    };

  // Función para aumentar la cantidad de un producto
  const aumentarCantidad = (producto) => {
          const carritoActualizado = carrito.map((item) =>
              item.id === producto.id && item.talla === producto.talla
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
          setCarrito(carritoActualizado);
      } 

  const handleBuy = async () => {
    const id = await crearPreferencia();
    if (id) {
      setPreferenceId(id);
    }
  };

  const crearPreferencia = async () => {
    if (carrito.length > 0) {
      try {
        const preference = {
          items: carrito.map((item) => ({
            title: `${item.nombre} (${item.talla})`,
            quantity: item.cantidad,
            unit_price: item.precio,
          })),
          back_urls: {
            success: 'https://www.youtube.com/watch?v=-VD-l5BQsuE',
            failure: 'https://www.youtube.com/watch?v=-VD-l5BQsuE',
            pending: 'https://www.youtube.com/watch?v=-VD-l5BQsuE',
          },
          auto_return: 'approved',
        };

        const response = await fetch('http://localhost:3001/create_preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preference),
        });
        const data = await response.json();

        return data.id; // Devolvemos el ID de la preferencia
      } catch (error) {
        console.error('Error al crear la preferencia:', error);
      }
    }
    return null;
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Carrito de Compras</Typography>
      {carrito.length === 0 ? (
        <Typography variant="body1">El carrito está vacío</Typography>
      ) : (
        <>
          {carrito.map((producto, index) => (
            <Card key={index} style={{ marginBottom: 20 }}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <img src={producto.imagen} alt={producto.nombre} style={{ width: 100, height: 100 }} />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">{producto.nombre} ({producto.talla})</Typography>
                    <Typography variant="body1">${producto.precio}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <IconButton onClick={() => reducirCantidad(producto)} aria-label="decrease">
                        <Remove />
                      </IconButton>
                      <InputBase
                        value={producto.cantidad}
                        inputProps={{ style: { textAlign: 'center' } }}
                        readOnly
                      />
                      <IconButton onClick={() => aumentarCantidad(producto)} aria-label="increase">
                        <Add />
                      </IconButton>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removerDelCarrito(producto)}
                    >
                      Borrar producto
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          {/* Cálculo del subtotal */}
          <Typography variant="h5" style={{ marginTop: 20 }}>
            Subtotal: $
            {carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0).toFixed(2)}
          </Typography>

          <Button onClick={handleBuy}>
            Comprar
          </Button>

          {preferenceId && (
            <div style={{ padding: '20px' }}>
              <Wallet initialization={{ preferenceId: preferenceId }} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Carrito;