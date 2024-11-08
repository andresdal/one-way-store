import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  IconButton, 
  Drawer,
  Container,
  Paper,
  Box,
  Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DetalleProducto from './DetalleProducto';
import Carrito from './Carrito';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import SuccessPage from './SuccessPage';
import FailurePage from './FailurePage';
import PendingPage from './PendingPage';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa los estilos del carrusel
import { Carousel } from 'react-responsive-carousel';
import CrearProducto from './CrearProducto';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    initMercadoPago("APP_USR-f9decf82-f894-49d4-8455-a314d121f183");
  }, []);

  const productos = [
    { 
      id: 1, 
      nombre: 'Buzo Gris', 
      precio: 1200, 
      imagenes: ['/img_prod/buzo-gris.png'],
      descripcion: 'Buzo de algodón premium con acabado suave y cálido. Perfecto para el día a día.'
    },
    { 
      id: 2, 
      nombre: 'Campera Negra', 
      precio: 2500, 
      imagenes: ['/img_prod/campera-negra1.png', '/img_prod/campera-negra2.png'],
      descripcion: 'Campera resistente al agua con forro térmico. Ideal para días fríos.'
    },
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
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8))',
        backgroundSize: 'cover'
      }}>
        <AppBar position="static" sx={{ backgroundColor: '#2c3e50' }}>
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600
            }}>
              ONE WAY
            </Typography>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <ShoppingCartIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                ({totalCantidadCarrito})
              </Typography>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <Paper sx={{ 
                position: 'relative',
                backgroundColor: '#34495e',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center',
                marginBottom: 4
              }}>
                <Container>
                  <Typography variant="h3" component="h1" gutterBottom sx={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700
                  }}>
                    One Way Style
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    Tu estilo, tu camino
                  </Typography>
                  <Typography variant="body1" sx={{ maxWidth: '600px', margin: '0 auto' }}>
                    Descubre nuestra colección de ropa urbana diseñada para quienes buscan marcar tendencia 
                    con un estilo único y auténtico.
                  </Typography>
                </Container>
              </Paper>

              {/* Products Section */}
              <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ 
                  textAlign: 'center',
                  mb: 4,
                  fontFamily: 'Montserrat, sans-serif'
                }}>
                  Nuestra Colección
                </Typography>
                <Grid container spacing={4}>
                  {productos.map((producto) => (
                    <Grid item xs={12} sm={6} md={4} key={producto.id}>
                      <Card sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: '0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3
                        }
                      }}>
                        <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none' }}>
                          <Box sx={{ 
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <Carousel 
                              showThumbs={false} 
                              autoPlay 
                              infiniteLoop 
                              showStatus={false}
                              showArrows={false}
                            >
                              {producto.imagenes.map((imagen, index) => (
                                <div key={index}>
                                  <img 
                                    src={imagen} 
                                    alt={`${producto.nombre} ${index + 1}`}
                                    style={{
                                      width: '100%',
                                      height: 'auto',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                              ))}
                            </Carousel>
                          </Box>
                        </Link>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom component={Link} to={`/producto/${producto.id}`} sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 600
                          }}>
                            {producto.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {producto.descripcion}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${producto.precio}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>

              {/* Footer */}
              <Box component="footer" sx={{ 
                backgroundColor: '#2c3e50',
                color: 'white',
                py: 6,
                mt: 'auto'
              }}>
                <Container maxWidth="lg">
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Sobre One Way
                      </Typography>
                      <Typography variant="body2">
                        Somos una marca de ropa urbana comprometida con la calidad y el estilo. 
                        Nuestra misión es ayudarte a expresar tu personalidad a través de la moda.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Contacto
                      </Typography>
                      <Typography variant="body2">
                        Email: contacto@oneway.com<br />
                        Teléfono: (123) 456-7890<br />
                        Dirección: Calle Principal 123
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Síguenos
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                      <a href="https://www.instagram.com/oneway.style" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <IconButton color="inherit">
                          <InstagramIcon />
                        </IconButton>
                      </a>
                        <IconButton color="inherit">
                          <FacebookIcon />
                        </IconButton>
                        <IconButton color="inherit">
                          <WhatsAppIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  <Typography variant="body2" align="center">
                    © {new Date().getFullYear()} One Way. Todos los derechos reservados.
                  </Typography>
                </Container>
              </Box>
            </>
          }/>

          <Route path="/producto/:id" element={<DetalleProducto productos={productos} agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failure" element={<FailurePage />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/crear_producto" element={<CrearProducto />} />
        </Routes>

        <Drawer 
          anchor="right" 
          open={drawerOpen} 
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: { width: { xs: '90%', sm: 600 } }
          }}
        >
          <Carrito carrito={carrito} setCarrito={setCarrito} />
          {preferenceId && (
            <Box sx={{ p: 2 }}>
              <Wallet initialization={{ preferenceId: preferenceId }} />
            </Box>
          )}
        </Drawer>
      </Box>
    </Router>
  );
}

export default App;