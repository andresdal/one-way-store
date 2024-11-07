import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Typography, Button, Grid, CardMedia, TextField, MenuItem, IconButton, InputBase, Paper, Card, CardContent } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

function Carrito({ carrito, setCarrito }) {
    // Función para eliminar un producto o disminuir la cantidad
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
                        <Typography variant="h6" style={{ marginBottom: 10 }}>
                            {producto.nombre} ({producto.talla})
                        </Typography>
                        <Typography variant="body1">${producto.precio}</Typography>
                        </Grid>

                        {/* Aquí agregamos un espaciado horizontal entre el nombre y los botones */}
                        <Grid item style={{ marginLeft: '100px' }}>
                        <Paper style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => reducirCantidad(producto)} aria-label="decrease">
                            <Remove />
                            </IconButton>
                            <InputBase
                            value={producto.cantidad}
                            inputProps={{ style: { 
                                textAlign: 'center' ,
                                width: '20px',
                            } }}
                            readOnly
                            />
                            <IconButton onClick={() => aumentarCantidad(producto)} aria-label="increase">
                            <Add />
                            </IconButton>
                        </Paper>
                        </Grid>

                        <Grid item style={{ marginLeft: '10px' }}>
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
            </>
          )}
        </div>
      );
    };

export default Carrito;