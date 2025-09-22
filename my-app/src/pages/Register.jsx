import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaBirthdayCake, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { AiOutlineQq } from 'react-icons/ai';
import styles from './css/register.module.css';

// Componente para el indicador de pasos
const StepIndicator = ({ currentStep }) => {
    const steps = ['Datos', 'Email', 'Clave'];
    return (
        <div className={styles['step-indicator']}>
            {steps.map((step, index) => (
                <div key={index} className={`${styles.step} ${index + 1 === currentStep ? styles.active : ''} ${index + 1 < currentStep ? styles.completed : ''}`}>
                    <div className={styles['step-number']}>{index + 1}</div>
                    <div className={styles['step-title']}>{step}</div>
                </div>
            ))}
        </div>
    );
};

// Componente de guía de contraseña
const PasswordGuide = ({ password }) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasValidLength = password.length >= 8 && password.length <= 16;
    const hasMatch = password === password; // Siempre verdadero aquí, la validación de confirmación está en otro lugar

    const requirements = [
        { label: 'Una mayúscula', isValid: hasUpperCase },
        { label: 'Una minúscula', isValid: hasLowerCase },
        { label: 'Un número', isValid: hasNumber },
        { label: '8-16 caracteres', isValid: hasValidLength },
    ];

    return (
        <div className={styles['password-guide']}>
            <p>La contraseña debe contener:</p>
            <ul className='guia_clave'>
                {requirements.map((req, index) => (
                    <li key={index} className={req.isValid ? styles.valid : styles.invalid}>
                        {req.isValid ? <FaCheckCircle /> : <FaTimesCircle />}
                        {req.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Componente principal del registro
const Register = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        email: '',
        verificationCode: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [timer, setTimer] = useState(180);
    const [canAdvance, setCanAdvance] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    // useEffect para el temporizador
    useEffect(() => {
        let intervalId;
        if (isCodeSent && timer > 0) {
            intervalId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsCodeSent(false); // Detiene el temporizador y prepara para el siguiente envío
            setTimer(180);
        }
        return () => clearInterval(intervalId); // Limpia el intervalo en la re-renderización o desmontaje
    }, [isCodeSent, timer]);

    // useEffect para manejar la lógica de activación del botón Siguiente
    useEffect(() => {
        let isValid = false;
        if (currentStep === 1) {
            isValid = formData.nombre && formData.apellido && formData.fechaNacimiento && validateAge() && validateName(formData.nombre) && validateName(formData.apellido);
        } else if (currentStep === 2) {
            isValid = emailVerified;
        } else if (currentStep === 3) {
            isValid = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && validatePassword(formData.password);
        }
        setCanAdvance(isValid);
    }, [formData, currentStep, emailVerified]);
    
    const validateAge = () => {
        const fechaNacimiento = new Date(formData.fechaNacimiento);
        const fechaActual = new Date();
        const fechaLimite = new Date(fechaActual.getFullYear() - 18, fechaActual.getMonth(), fechaActual.getDate());
        return fechaNacimiento <= fechaLimite;
    };

    const validateName = (name) => {
        const regex = /^[a-zA-Z\s]{2,}$/;
        return regex.test(name);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/;
        return regex.test(password);
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (!formData.nombre || !formData.apellido || !formData.fechaNacimiento) {
                setError('Por favor, complete todos los campos.');
                return;
            }
            if (!validateName(formData.nombre) || !validateName(formData.apellido)) {
                setError('El nombre y el apellido solo pueden contener letras y espacios.');
                return;
            }
            if (!validateAge()) {
                setError('Debes ser mayor de 18 años.');
                return;
            }
        } else if (currentStep === 2) {
            if (!emailVerified) {
                setError('Por favor, verifique su correo electrónico.');
                return;
            }
        } else if (currentStep === 3) {
            if (!formData.password || !formData.confirmPassword) {
                setError('Por favor, complete todos los campos de contraseña.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Las contraseñas no coinciden.');
                return;
            }
            if (!validatePassword(formData.password)) {
                setPasswordError('La contraseña debe tener entre 8 y 16 caracteres, con al menos una mayúscula, una minúscula y un número.');
                return;
            }
        }
        
        setError('');
        setPasswordError('');
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handlePrev = () => {
        setError('');
        setPasswordError('');
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setError('');
        setPasswordError('');
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canAdvance) {
            setIsRegistering(true);
            // Simular un retraso en el registro
            try {
                const response = await fetch('/api/registrar-usuario/', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json", 
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                    body: JSON.stringify({ data: formData })
                });

                const data = await response.json()

                if (response.status != 201) {
                    if (response.status == 409){
                        throw new Error(data.Error || "El correo electronico ya se encuentra en uso.");
                    }
                    throw new Error(data.Error || "Ha ocurrido un error en la solicitud");
                }

                setIsRegistering(false);
                console.log('Formulario enviado:', formData);
                alert("¡Registro exitoso! Ya puedes iniciar sesión.");
            } catch (error) {
                alert(error);
                setIsRegistering(false);
            }
        }
    };
    
    // Función auxiliar para obtener CSRFToken
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const handleSendCode = async () => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            setError('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        setIsSendingCode(true);
        setError('');

        try {
            const res = await fetch("/api/enviar-code/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Ha ocurrido un error en la solicitud");
            }
            alert(data.message || "Código enviado exitosamente.");
            setIsCodeSent(true); // Solo activa el temporizador si el envío es exitoso
        } catch (error) {
            console.error("Ha ocurrido un error: ", error);
            setError(error.message || "No se pudo enviar el código. Intente de nuevo.");
        } finally {
            setIsSendingCode(false); // Siempre desactiva el estado de envío
        }
    };

    const handleVerifyCode = async (code) => {
        if (code.length < 6) return;
        
        setIsVerifying(true);
        setError('');

        try {
            const response = await fetch('/api/verificar-code/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify({ 'codigo': code }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "El código ingresado es incorrecto!");
            }

            setEmailVerified(true);
            alert(data.message || "Código verificado exitosamente");
        } catch (error) {
            console.error("Ha ocurrido un error: ", error);
            setError(error.message || "No se pudo verificar el código. Intente de nuevo.");
            setEmailVerified(false);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerificationCodeChange = (e) => {
        const { value } = e.target;
        handleChange(e); // Actualiza el estado del formulario
        if (value.length === 6) {
            handleVerifyCode(value);
        }
    };

    return (
        <div className={styles['register-container']}>
            <div className={styles.register}>
                <Link to="/" className={styles['back-icon']}>
                    <FaArrowLeft />
                </Link>
                <AiOutlineQq size={80} />
                <h1>Crear Cuenta</h1>
                <StepIndicator currentStep={currentStep} />
                {error && <p className={styles['message-error']}>{error}</p>}
                {passwordError && <p className={styles['message-error']}>{passwordError}</p>}
                
                <form onSubmit={handleSubmit}>
                    {/* Step 1: Datos Personales */}
                    <div className={`${styles['form-step']} ${currentStep === 1 ? styles.active : ''}`}>
                        <div className={styles['input-wrapper']}>
                            <FaUser className={styles['input-icon']} />
                            <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <FaUser className={styles['input-icon']} />
                            <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <FaBirthdayCake className={styles['input-icon']} />
                            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                        </div>
                    </div>
                    
                    {/* Step 2: Verificación de Email */}
                    <div className={`${styles['form-step']} ${currentStep === 2 ? styles.active : ''}`}>
                        <div className={styles['email-input-group']}>
                            <div className={styles['input-wrapper']}>
                                <FaEnvelope className={styles['input-icon']} />
                                <input type="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} disabled={emailVerified || isCodeSent} />
                            </div>
                            <button type="button" onClick={handleSendCode} disabled={!formData.email || isSendingCode || isCodeSent || emailVerified}>
                                {isSendingCode ? (
                                    'Enviando...'
                                ) : isCodeSent ? (
                                    `Reenviar en ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`
                                ) : (
                                    'Enviar Código'
                                )}
                            </button>
                        </div>
                        <div className={`${styles['input-wrapper']} ${styles['email-verification']}`}>
                            <div className={styles['input-icon-container']}>
                                {isVerifying ? (
                                    <FaSpinner className={`${styles['input-icon']} ${styles['spinner']}`} />
                                ) : (
                                    <FaLock className={styles['input-icon']} />
                                )}
                            </div>
                            <input
                                type="text"
                                name="verificationCode"
                                placeholder="Código de 6 dígitos"
                                value={formData.verificationCode}
                                onChange={handleVerificationCodeChange}
                                maxLength="6"
                                disabled={emailVerified || isVerifying}
                            />
                        </div>
                    </div>
                    
                    {/* Step 3: Contraseña */}
                    <div className={`${styles['form-step']} ${currentStep === 3 ? styles.active : ''}`}>
                        <div className={styles['input-wrapper']}>
                            <FaLock className={styles['input-icon']} />
                            <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <FaLock className={styles['input-icon']} />
                            <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleChange} />
                        </div>
                        <PasswordGuide password={formData.password} />
                    </div>
                    
                    <div className={styles['button-group']}>
                        {currentStep > 1 && <button type="button" className={styles['prev-btn']} onClick={handlePrev}>Anterior</button>}
                        {currentStep < 3 && <button type="button" onClick={handleNext} disabled={!canAdvance}>Siguiente</button>}
                        {currentStep === 3 && (
                            <button type="submit" disabled={!canAdvance || isRegistering}>
                                {isRegistering ? (
                                    <>
                                        <FaSpinner className={styles['spinner']} />
                                        Registrando...
                                    </>
                                ) : (
                                    'Registrarse'
                                )}
                            </button>
                        )}
                    </div>
                </form>
                
                <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
            </div>
        </div>
    );
};

export default Register;