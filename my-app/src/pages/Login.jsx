import reactLogo from '../assets/react.svg';
import './css/login.css';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import { AiOutlineQq } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2'; // Importamos SweetAlert2

// Función para obtener la cookie CSRF
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const FormLogin = () => {
    const [formData, setFormData] = useState({
        correo: '',
        clave: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.correo.trim()) {
            newErrors.correo = "El correo es obligatorio.";
        } else if (!emailRegex.test(formData.correo)) {
            newErrors.correo = "El formato del correo es inválido.";
        }

        if (!formData.clave.trim()) {
            newErrors.clave = "La clave es obligatoria.";
        } else if (formData.clave.length < 6) {
            newErrors.clave = "La clave debe tener al menos 6 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Mostrar SweetAlert2 para errores de validación
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                html: Object.values(errors).join('<br/>')
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                //credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                // Mensaje de error del servidor
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: data.message || "Credenciales inválidas."
                });
            } else {
                // Mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: data.message || 'Inicio de sesión exitoso.'
                });

                window.location.replace('/dashboard')
            }

        } catch (error) {
            // Mensaje de error de red
            Swal.fire({
                icon: 'error',
                title: 'Error de red',
                text: "No se pudo conectar al servidor. Inténtalo de nuevo más tarde."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                        type="email"
                        name="correo"
                        id="correo"
                        placeholder="Correo Electrónico"
                        value={formData.correo}
                        onInput={handleChange}
                    />
                </div>

                <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        name="clave"
                        id="clave"
                        placeholder="************"
                        value={formData.clave}
                        onInput={handleChange}
                    />
                </div>

                <a href="#">¿Has olvidado la clave?</a>
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    ) : 'Iniciar Sesión'}
                </button>
            </form>
        </>
    );
};

const Login = () => {
    return (
        <>
            <div className="login-container">
                <div className="login">
                    <Link to="/" className="back-icon">
                        <FaArrowLeft />
                    </Link>
                    <AiOutlineQq size={80} />
                    <h1>Inicio de Sesión</h1>
                    <FormLogin />
                    <p>¿No tienes una cuenta? <a href="/register">Regístrate</a></p>
                </div>
            </div>
        </>
    );
};

export default Login;