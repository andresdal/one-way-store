import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Grid, CardMedia, TextField, MenuItem, IconButton, InputBase, Paper } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

// Componente para el detalle del producto
function DetalleProducto({ productos, agregarAlCarrito }) {
  const { id } = useParams();
  const producto = productos.find(p => p.id === parseInt(id));

  // Estado para la talla y cantidad
  const [talla, setTalla] = React.useState('M');
  const [cantidad, setCantidad] = React.useState(1);

  const handleAgregar = () => {
    if (talla) {
      agregarAlCarrito(producto, cantidad, talla);
    } else {
      alert('Por favor selecciona una talla.');
    }
  };

  if (!producto) {
    return <Typography variant="h4">Producto no encontrado</Typography>;
  }

  // Función para aumentar la cantidad
  const aumentarCantidad = () => setCantidad(cantidad + 1);

  // Función para reducir la cantidad
  const reducirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  return (
    <Grid container spacing={4} style={{ padding: 20 }}>
      {/* Imagen del producto */}
      <Grid item xs={12} md={6}>
        <CardMedia
          component="img"
          image={producto.imagen}
          alt={producto.nombre}
          style={{ width: '100%', height: 'auto', maxWidth: '400px', margin: '0 auto' }} // Ajustar el tamaño máximo de la imagen
        />
      </Grid>

      {/* Detalles del producto */}
      <Grid item xs={12} md={6}>
        <Typography variant="h4" gutterBottom>{producto.nombre}</Typography>
        <Typography variant="h5" color="textSecondary">${producto.precio.toLocaleString('es-AR')}</Typography>
        <Typography variant="body1" style={{ margin: '20px 0' }}>Ver más detalles</Typography>

        {/* Selector de talla */}
        <Typography variant="body1">Talle: {talla}</Typography>
        <TextField
          select
          value={talla}
          onChange={(e) => setTalla(e.target.value)}
          variant="outlined"
          size="small"
          style={{ marginBottom: '20px', width: '100px' }}
        >
          <MenuItem value="S">S</MenuItem>
          <MenuItem value="M">M</MenuItem>
          <MenuItem value="L">L</MenuItem>
        </TextField>

        {/* Selector de cantidad */}
        <Paper elevation={1} style={{ display: 'flex', alignItems: 'center', maxWidth: '150px', marginBottom: '20px' }}>
          <IconButton onClick={reducirCantidad} aria-label="reduce">
            <Remove />
          </IconButton>
          <InputBase
            value={cantidad}
            inputProps={{ style: { textAlign: 'center' } }}
            readOnly
          />
          <IconButton onClick={aumentarCantidad} aria-label="increase">
            <Add />
          </IconButton>
        </Paper>

        {/* Botón para agregar al carrito */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAgregar}
          style={{ width: '100%', maxWidth: '250px' }} // Controlar el tamaño del botón
        >
          Agregar al carrito
        </Button>
      </Grid>
    </Grid>
  );
}

export default DetalleProducto;
