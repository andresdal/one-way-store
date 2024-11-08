import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Typography, Box, Paper, IconButton } from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';

const CrearProducto = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [peso, setPeso] = useState('');
  const [precio, setPrecio] = useState('');
  const [precioDesc, setPrecioDesc] = useState('');
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [imagenesPorColor, setImagenesPorColor] = useState({});
  const [variaciones, setVariaciones] = useState([{ tallaId: '', colorId: '', cantStock: '' }]);
  const [coloresUnicos, setColoresUnicos] = useState([]);
  const [variacionesPrevias, setVariacionesPrevias] = useState([]);

  useEffect(() => {
    const fetchTallasAndColores = async () => {
      try {
        const [tallasResponse, coloresResponse] = await Promise.all([
          axios.get('http://localhost:3001/tallas'),
          axios.get('http://localhost:3001/colores')
        ]);
        setTallas(tallasResponse.data);
        setColores(coloresResponse.data);
      } catch (error) {
        console.error('Error fetching tallas and colores:', error);
      }
    };
    fetchTallasAndColores();
  }, []);

  // Manejar cambio de imagen
  const handleImageChange = (e, colorId) => {
    const files = Array.from(e.target.files);
    setImagenesPorColor((prev) => ({
      ...prev,
      [colorId]: [...(prev[colorId] || []), ...files],
    }));
  };

  // Eliminar una imagen
  const handleImageRemove = (colorId, index) => {
    setImagenesPorColor((prev) => {
      const newImages = prev[colorId].filter((_, i) => i !== index);
      return { ...prev, [colorId]: newImages };
    });
  };

  const agregarVariacion = () => {
    setVariaciones([...variaciones, { tallaId: '', colorId: '', cantStock: '' }]);
  };

  const handleVariacionChange = (index, e) => {
    const newVariaciones = [...variaciones];
    const prevVariaciones = [...variacionesPrevias];
    const prevColorId = prevVariaciones[index]?.colorId;
  
    newVariaciones[index][e.target.name] = e.target.value;
    setVariaciones(newVariaciones);
  
    if (e.target.name === 'colorId') {
      const colorId = e.target.value;
      const color = colores.find(c => c.id === colorId);
  
      // Eliminar el color anterior si ya no está presente en ninguna variación
      if (prevColorId && prevColorId !== colorId) {
        const colorUsado = newVariaciones.some(variacion => variacion.colorId === prevColorId);
        if (!colorUsado) {
          setColoresUnicos(prevColoresUnicos => prevColoresUnicos.filter(c => c.id !== prevColorId));
        }
      }
  
      // Actualizar coloresUnicos
      if (color && !coloresUnicos.some(c => c.id === colorId)) {
        setColoresUnicos(prevColoresUnicos => [...prevColoresUnicos, color]);
      }
  
      // Actualizar variacionesPrevias
      prevVariaciones[index] = { ...newVariaciones[index] };
      setVariacionesPrevias(prevVariaciones);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('peso', peso);
    formData.append('precio', precio);
    formData.append('precio_descuento', precioDesc);

    // Enviar variaciones (con stock)
    formData.append('stockVariaciones', JSON.stringify(variaciones));

    // Enviar imágenes por color
    Object.keys(imagenesPorColor).forEach((colorId) => {
      const files = imagenesPorColor[colorId];
      for (let i = 0; i < files.length; i++) {
        formData.append(`imagenes_${colorId}`, files[i]);
      }
    });

    axios
      .post('http://localhost:3001/crear_producto', formData)
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        console.error(err);
        alert('Hubo un error al crear el producto');
      });
  };

  const eliminarVariacion = (index) => {
    setVariaciones(variaciones.filter((_, i) => i !== index));

    const colorId = variaciones[index].colorId;
    const isLastColor = !variaciones.some((v, i) => v.colorId === colorId && i !== index);
    if (isLastColor) {
      setColoresUnicos(coloresUnicos.filter((color) => color.id !== colorId));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Crear Producto</Typography>
      <form onSubmit={handleSubmit}>
        {/* Información básica del producto */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Descripción"
              fullWidth
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Peso"
              fullWidth
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Precio"
              fullWidth
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Precio con descuento"
              fullWidth
              value={precioDesc}
              onChange={(e) => setPrecioDesc(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Variaciones de talla y color */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Variaciones de Producto</Typography>
          {variaciones.map((variacion, index) => (
            <Grid container spacing={3} key={index}>
              <Grid item xs={12} sm={1}>
                <FormControl fullWidth>
                  <InputLabel>Talla</InputLabel>
                  <Select
                    value={variacion.tallaId}
                    name="tallaId"
                    onChange={(e) => handleVariacionChange(index, e)}
                  >
                    <MenuItem value="">Seleccione talla</MenuItem>
                    {tallas.map((talla) => (
                      <MenuItem key={talla.id} value={talla.id}>
                        {talla.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={1}>
                <FormControl fullWidth>
                  <InputLabel>Color</InputLabel>
                  <Select
                    value={variacion.colorId}
                    name="colorId"
                    onChange={(e) => handleVariacionChange(index, e)}
                  >
                    <MenuItem value="">Seleccione color</MenuItem>
                    {colores.map((color) => (
                      <MenuItem key={color.id} value={color.id}>
                        {color.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={1}>
                <TextField
                  label="Cantidad en stock"
                  fullWidth
                  type="number"
                  value={variacion.cantStock}
                  name="cantStock"
                  onChange={(e) => handleVariacionChange(index, e)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => eliminarVariacion(index)}
                >
                  Eliminar Variación
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" onClick={agregarVariacion} sx={{ mt: 2 }}>
            Agregar Variación
          </Button>
        </Box>

        {/* Carga de imágenes por color */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Imágenes por Color</Typography>
          {/* Solo mostrar si hay colores únicos */}
          {coloresUnicos.length > 0 ? (
            coloresUnicos.map((color, index) => (
              <Box key={index} mb={3}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {color.nombre}
                </Typography>

                {/* Carga de imágenes */}
                <Box display="flex" flexDirection="column" gap={2}>
                  {/* Botón para cargar nuevas imágenes */}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddCircleOutline />}
                  >
                    Cargar Imágenes
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={(e) => handleImageChange(e, color.id)}
                    />
                  </Button>

                  {/* Previsualización de imágenes */}
                  {imagenesPorColor[color.id] && (
                    <Grid container spacing={2}>
                      {imagenesPorColor[color.id].map((file, i) => (
                        <Grid item key={i}>
                          <Paper sx={{ position: 'relative', display: 'inline-block' }}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Imagen para ${color.nombre}`}
                              style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '5px',
                                marginBottom: '8px',
                              }}
                            />
                            {/* Botón para eliminar la imagen */}
                            <IconButton
                              size="small"
                              onClick={() => handleImageRemove(color.id, i)}
                              sx={{ position: 'absolute', top: 0, right: 0 }}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">No hay colores seleccionados para mostrar imágenes.</Typography>
          )}
        </Box>

        {/* Botón para enviar el formulario */}
        <Box mt={4}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Crear Producto
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CrearProducto;