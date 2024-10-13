import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import '../css/Formulario.css';
import logo from '../images/LogoHotelRaglan.jpg';

const Formulario = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    celular: '',
    fechaEntrada: '',
    fechaSalida: '',
    total: '',
    tipoHabitacion: ''
  });

  const [errors, setErrors] = useState({}); // Estado para los errores
  const formRef = useRef(null);
  const buttonRef = useRef(null); // Ref para el botón

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Limpiar error del campo al cambiar
  };

  const validateForm = () => {
    let validationErrors = {};
    const requiredFields = ['nombre', 'apellido', 'celular', 'fechaEntrada', 'fechaSalida', 'total', 'tipoHabitacion'];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        validationErrors[field] = 'Este campo es obligatorio';
      }
    });

    // Validar el formato del celular (por ejemplo, debe tener 10 dígitos)
    if (formData.celular && formData.celular.length < 10) {
      validationErrors.celular = 'El celular debe tener al menos 10 dígitos';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // Retorna verdadero si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Si hay errores, no enviar el formulario
    }

    const image = await generarImagen(formData.nombre.concat(formData.apellido));
    enviarPorWhatsApp(formData.celular, image);
  };

  const generarImagen = async (nombreYapellido) => {
    // Oculta temporalmente el botón antes de generar la imagen
    buttonRef.current.style.display = 'none';

    const canvas = await html2canvas(formRef.current);
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = nombreYapellido;
    link.click();

    // Muestra el botón nuevamente después de generar la imagen
    buttonRef.current.style.display = 'block';

    return imgData;
  };

  const enviarPorWhatsApp = (telefono, image) => {
    const mensaje = encodeURIComponent('Hola, te adjunto el comprobante de pago.');
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="logo-container">
          <img src={logo} alt="Logo Hotel Raglan" />
        </div>
        <h2>Comprobante de Pago</h2>
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          {errors.nombre && <span className="error">{errors.nombre}</span>}
        </div>
        <div>
          <label>Apellido:</label>
          <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
          {errors.apellido && <span className="error">{errors.apellido}</span>}
        </div>
        <div>
          <label>Celular:</label>
          <input type="tel" name="celular" value={formData.celular} onChange={handleChange} required />
          {errors.celular && <span className="error">{errors.celular}</span>}
        </div>
        <div>
          <label>Fecha de Entrada:</label>
          <input type="date" name="fechaEntrada" value={formData.fechaEntrada} onChange={handleChange} required />
          {errors.fechaEntrada && <span className="error">{errors.fechaEntrada}</span>}
        </div>
        <div>
          <label>Fecha de Salida:</label>
          <input type="date" name="fechaSalida" value={formData.fechaSalida} onChange={handleChange} required />
          {errors.fechaSalida && <span className="error">{errors.fechaSalida}</span>}
        </div>
        <div>
          <label>Tipo de Habitación:</label>
          <select name="tipoHabitacion" value={formData.tipoHabitacion} onChange={handleChange} required>
            <option value="">Seleccione una opción</option>
            <option value="single estandar">Single Estándar</option>
            <option value="single deluxe">Single Deluxe</option>
            <option value="doble estandar">Doble Estándar</option>
            <option value="doble deluxe">Doble Deluxe</option>
            <option value="triple deluxe">Triple Deluxe</option>
            <option value="cuadruple deluxe">Cuádruple Deluxe</option>
            <option value="apart">Apart</option>
          </select>
          {errors.tipoHabitacion && <span className="error">{errors.tipoHabitacion}</span>}
        </div>
        <div>
          <label>Total Abonado $</label>
          <input type="number" name="total" value={formData.total} onChange={handleChange} required />
          {errors.total && <span className="error">{errors.total}</span>}
        </div>
        <button ref={buttonRef} type="submit">Enviar Comprobante</button>
      </form>
      <style jsx>{`
        .error {
          color: red;
          font-size: 12px;
        }
      `}</style>
    </>
  );
};

export default Formulario;
