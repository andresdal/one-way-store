import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Grid, Card, CardContent, Button, Drawer, IconButton } from '@mui/material';  // Añadido Drawer
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';  // Icono del carrito
import DetalleProducto from './DetalleProducto';
import Carrito from './Carrito';

function App() {
  const [carrito, setCarrito] = React.useState([]);  // Estado del carrito
  const [drawerOpen, setDrawerOpen] = React.useState(false);  // Estado del Drawer

  const productos = [  // Ejemplo de productos
    { id: 1, nombre: 'Buzo Gris', precio: 1200, imagen: '/img_prod/buzo-gris.png' },
    { id: 2, nombre: 'Campera Negra', precio: 2500, imagen: '/img_prod/campera-negra.png' },
  ];

  const totalCantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

  const agregarAlCarrito = (producto, cantidad, talla) => {
    const productoExistente = carrito.find(
      (item) => item.id === producto.id && item.talla === talla
    );
  
    if (productoExistente) {
      const carritoActualizado = carrito.map((item) =>
        item.id === producto.id && item.talla === talla
          ? { ...item, cantidad: item.cantidad + cantidad } 
          : item
      );
      setCarrito(carritoActualizado);
    } else {
      setCarrito([...carrito, { ...producto, cantidad, talla }]);
    }
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Tienda One Way</Link>
          </Typography>
          {/* Botón del carrito que abre la solapa deslizante */}
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <ShoppingCartIcon />
            <Typography variant="h6" style={{ marginLeft: 8 }}>
              ({totalCantidadCarrito}) 
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={
          <Grid container spacing={3} style={{ padding: 20 }}>
            {productos.map((producto) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
                <Card>
                  <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%" }} />
                  </Link>
                  <CardContent>
                    <Typography variant="h6">
                      <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {producto.nombre}
                      </Link>
                    </Typography>
                    <Typography variant="body1">${producto.precio}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        }/>

        <Route path="/producto/:id" element={<DetalleProducto productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
      </Routes>

      {/* Solapa deslizante para el carrito */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Carrito carrito={carrito} setCarrito={setCarrito} /> {/* Pasamos el carrito al Drawer */}
      </Drawer>
    </Router>
  );
}

export default App;
