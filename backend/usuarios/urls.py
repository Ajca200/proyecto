from django.urls import path
from .views import EnviarCodigoVerificacion, VerificarCodigo, CrearUsuario, LoginView, EstadoSesion

urlpatterns = [
    path('enviar-code/', EnviarCodigoVerificacion.as_view(), name='codigo de verificacion de correo electronico'),
    path('verificar-code/', VerificarCodigo.as_view(), name='verificacion de codigo'),
    path('registrar-usuario/', CrearUsuario.as_view(), name='crear usuario nuevo'),
    path('login/', LoginView.as_view(), name='verificar credenciales'),
    path('estado-sesion/', EstadoSesion.as_view(), name='verificar el estado de la sesion del usuario')
]
