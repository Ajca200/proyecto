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

const FetchPerfil = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/perfil/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken") // 🔑 si ya tenías un csrftoken en cookie --- IGNORE ---
            },
            credentials: "include" // 🔑 asegura que la cookie sessionid viaje
        });
        const data = await response.json();
        
        if (!response.ok) {
            console.error("No autenticado:", data.error);
            window.location.href = "/login"; // Redirigir al login si no está autenticado
            return null;
        } else {
            return data; // Retorna los datos del perfil
        }
    } catch (error) {
        console.error("Error de red:", error);
        window.location.href = "/login"; // Redirigir al login en caso de error de red
        return null;
    }
}

export default FetchPerfil;