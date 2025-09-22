import React from "react";
import reactLogo from '../../assets/react.svg';
import { Link } from "react-router-dom";
import '../css/header.css';

const HeaderHome = () => {
    const handleReset = (e) => {
        // Prevent form submission if inside a real form
        e.preventDefault();
        const searchInput = document.getElementById('barra-busqueda');
        if (searchInput) {
            searchInput.value = '';
        }
    };

    return (
        <>
            {/* Header para Home */}
            <header>
                {/* Logo provicional */}
                <div className="logo">
                    <img src={reactLogo} alt="Logo" />
                </div>

                {/* Formulario para la busqueda de productos */}
                <div className="contenedor-form-busqueda">
                    <form action="#" method="post" onSubmit={(e) => e.preventDefault()}>
                        <input type="search" name="barra-busqueda" id="barra-busqueda" placeholder="Busca lo mejor" />
                        {/* Changed to a button for better styling and semantics */}
                        <button type="button" id="btn-reset" onClick={handleReset}>
                            &times;
                        </button>
                    </form>
                </div>

                {/* Botones de inicio de sesion y registro */}
                <div className="botones-i-r">
                    <Link to="/login"><button type="button" className="login">Iniciar Sesion</button></Link>
                    <Link to="/register"><button type="button" className="register">Registarse</button></Link>
                </div>
            </header>
        </>
    );
};

export default HeaderHome;
