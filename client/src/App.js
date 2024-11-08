import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Grid, Card, CardContent, Button, Drawer, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DetalleProducto from './DetalleProducto';
import Carrito from './Carrito';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'; // Asegúrate de estar importando initMercadoPago

// Componentes para las páginas de resultado de pago
import SuccessPage from './SuccessPage';
import FailurePage from './FailurePage';
import PendingPage from './PendingPage';

function App() {
  const [carrito, setCarrito] = useState([]); // Estado del carrito
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado del Drawer
  const [preferenceId, setPreferenceId] = useState(null); // ID de la preferencia de pago

  // Inicializamos MercadoPago al inicio con tu public key
  useEffect(() => {
    initMercadoPago("APP_USR-f9decf82-f894-49d4-8455-a314d121f183");
  }, []);

  const productos = [
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

  useEffect(() => {
  }, [carrito]);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Tienda One Way</Link>
          </Typography>
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

        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failure" element={<FailurePage />} />
        <Route path="/pending" element={<PendingPage />} />
      </Routes>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Carrito carrito={carrito} setCarrito={setCarrito} />
        {preferenceId && (
          <div style={{ padding: '20px' }}>
            <Wallet initialization={{ preferenceId: preferenceId }} />
          </div>
        )}
      </Drawer>
    </Router>
  );
}

export default App;
