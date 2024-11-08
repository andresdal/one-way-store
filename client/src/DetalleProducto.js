import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Grid, 
  CardMedia, 
  TextField, 
  MenuItem, 
  IconButton, 
  InputBase, 
  Paper,
  Box,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Rating,
  Chip,
  Snackbar,
  Alert,
  Divider,
  Zoom
} from '@mui/material';
import { 
  Add, 
  Remove, 
  ArrowBack,
  LocalShipping,
  Security,
  Loop,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function DetalleProducto({ productos, agregarAlCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const producto = productos.find(p => p.id === parseInt(id));
  
  const [talla, setTalla] = useState('M');
  const [cantidad, setCantidad] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [mainImage, setMainImage] = useState('');
  
  useEffect(() => {
    if (producto) {
      setMainImage(producto.imagenes[0]);
      // Simular carga de imágenes adicionales
    }
  }, [producto]);

  if (!producto) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        p: 4 
      }}>
        <Typography variant="h4" gutterBottom>Producto no encontrado</Typography>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          variant="contained"
        >
          Volver al inicio
        </Button>
      </Box>
    );
  }

  const handleAgregar = () => {
    if (talla) {
      agregarAlCarrito(producto, cantidad, talla);
      setShowSnackbar(true);
    } else {
      alert('Por favor selecciona una talla.');
    }
  };

  const aumentarCantidad = () => setCantidad(prev => prev + 1);
  const reducirCantidad = () => setCantidad(prev => prev > 1 ? prev - 1 : 1);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          component="button"
          underline="hover"
          color="inherit"
          onClick={() => navigate('/')}
        >
          Inicio
        </Link>
        <Typography color="text.primary">{producto.nombre}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Columna de imágenes */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <Zoom in={true}>
              <CardMedia
                component="img"
                image={mainImage}
                alt={producto.nombre}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Zoom>
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
              }}
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Box>
          
          {/* Miniaturas */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 2, 
            justifyContent: 'center' 
          }}>
            {producto.imagenes?.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt={`Vista ${index + 1}`}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  opacity: mainImage === img ? 1 : 0.6,
                  transition: '0.3s',
                  '&:hover': { opacity: 1 }
                }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </Box>
        </Grid>

        {/* Detalles del producto */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              {producto.nombre}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${producto.precio.toLocaleString('es-AR')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={4.5} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                (128 reseñas)
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              {producto.descripcion || "Descubre nuestro exclusivo diseño que combina estilo y comodidad. Fabricado con materiales de alta calidad para garantizar durabilidad y un ajuste perfecto."}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Selector de talla */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['XS', 'S','M', 'L'].map((size) => (
                <Chip
                  key={size}
                  label={size}
                  onClick={() => setTalla(size)}
                  color={talla === size ? 'primary' : 'default'}
                  sx={{ 
                    minWidth: 60,
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Selector de cantidad */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Cantidad
            </Typography>
            <Paper 
              elevation={0} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                maxWidth: 150,
                border: 1,
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <IconButton onClick={reducirCantidad} size="small">
                <Remove />
              </IconButton>
              <InputBase
                value={cantidad}
                inputProps={{ 
                  style: { 
                    textAlign: 'center',
                    width: '80px'
                  } 
                }}
                readOnly
              />
              <IconButton onClick={aumentarCantidad} size="small">
                <Add />
              </IconButton>
            </Paper>
          </Box>

          {/* Botón de compra */}
          <Button
            variant="contained"
            size="large"
            onClick={handleAgregar}
            fullWidth
            sx={{ 
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            Agregar al carrito
          </Button>

          {/* Beneficios */}
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  flexDirection: 'column',
                  textAlign: 'center'
                }}>
                  <LocalShipping color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2">Envío gratis</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  flexDirection: 'column',
                  textAlign: 'center'
                }}>
                  <Security color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2">Pago seguro</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  flexDirection: 'column',
                  textAlign: 'center'
                }}>
                  <Loop color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2">Devolución fácil</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs de información adicional */}
      <Box sx={{ mt: 6 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          centered
          sx={{
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Tab label="Descripción" />
          <Tab label="Especificaciones" />
          <Tab label="Reseñas" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography paragraph>
            Este producto está confeccionado con los mejores materiales, 
            garantizando durabilidad y comodidad. Ideal para uso diario y 
            diferentes ocasiones. El diseño moderno y versátil te permitirá 
            crear múltiples combinaciones.
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Material</Typography>
              <Typography paragraph>Algodón 100%</Typography>
              
              <Typography variant="subtitle2">Cuidados</Typography>
              <Typography paragraph>Lavar a máquina a 30°C</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">País de origen</Typography>
              <Typography paragraph>Argentina</Typography>
              
              <Typography variant="subtitle2">Código de producto</Typography>
              <Typography>#{producto.id}</Typography>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Opiniones de clientes
            </Typography>
            {/* Aquí podrías agregar un componente de reseñas */}
            <Typography color="text.secondary">
              Aún no hay reseñas para este producto.
            </Typography>
          </Box>
        </TabPanel>
      </Box>

      {/* Snackbar de confirmación */}
      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success"
          variant="filled"
        >
          Producto agregado al carrito
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DetalleProducto;