from django.urls import path
from .views import EnviarCodigoVerificacion, VerificarCodigo, CrearUsuario, LoginView, PerfilView, ObtenerProductos, VerCarritoView, AgregarItemCarritoView, CrearCarritoView, ActualizarItemView, EliminarItemView, DireccionesView

urlpatterns = [
    path('enviar-code/', EnviarCodigoVerificacion.as_view(), name='codigo de verificacion de correo electronico'),
    path('verificar-code/', VerificarCodigo.as_view(), name='verificacion de codigo'),
    path('registrar-usuario/', CrearUsuario.as_view(), name='crear usuario nuevo'),
    path('login/', LoginView.as_view(), name='verificar credenciales'),
    path('perfil/', PerfilView.as_view(), name='obtener perfil del usuario'),
    path('productos/', ObtenerProductos.as_view(), name='obtener productos disponibles'),
    path('carrito/', VerCarritoView.as_view(), name='ver carrito del usuario'),
    path('carrito/agregar-item/', AgregarItemCarritoView.as_view(), name='agregar item al carrito'),
    path('carrito/crear/', CrearCarritoView.as_view(), name='crear carrito para usuario'),
    path('carrito/actualizar-item/', ActualizarItemView.as_view(), name='actualizar item del carrito'),
    path('carrito/eliminar-item/', EliminarItemView.as_view(), name='eliminar item del carrito'),
    path('direcciones/', DireccionesView.as_view(), name='gestionar direcciones del usuario'),
]
