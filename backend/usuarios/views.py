from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from django.contrib.auth.hashers import make_password, check_password
from django.db import connection, DatabaseError
from psycopg2.errors import UniqueViolation
import os
import secrets
import yagmail
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
from .serializers import UsuarioSerializer, LoginSerializer
from django.shortcuts import redirect
from functools import wraps
from django.http import JsonResponse

# endpoint para enviar código de verificación
class EnviarCodigoVerificacion(APIView):
    def post(self, request):
        # Obtener el correo del cuerpo de la solicitud
        email = request.data.get('email')

        # Validar que el correo no esté vacío  
        if not email:
            return Response({'message': 'Correo no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generar un código seguro de 6 dígitos
        codigo_verificacion = str(secrets.randbelow(10**6)).zfill(6)
        
        # Enviar código
        if self.enviar_codigo(codigo_verificacion, email):
            # Guardar el código y la expiración en la sesión
            request.session['codigo_verificacion'] = codigo_verificacion

            # El código expira en 10 minutos
            request.session['expira'] = (datetime.now() + timedelta(minutes=10)).isoformat()
            
            return Response({'message': 'Código enviado exitosamente'}, status=status.HTTP_200_OK)

        return Response({'message': 'Ha ocurrido un error al enviar el código. Intente más tarde.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Función para el codigo al correo
    def enviar_codigo(self, codigo_verificacion, correo_receptor) -> bool:
        try:
            yag = yagmail.SMTP(
                os.getenv("EMAIL_USER"),  # definido en tu .env
                os.getenv("EMAIL_PASSWORD")  # generado como App Password en Gmail
            )

            contenido = f"""
                <p style="font-size:16px; margin:0;">
                    Hola 👋, gracias por registrarte en <strong>Mis Viejos</strong>.
                </p>
                <p>Tu código de verificación es:</p>
                <p style="font-size:22px; font-weight:bold; letter-spacing:4px; color:#2563eb;">
                    {codigo_verificacion}
                </p>
                <p style="font-size:12px; color:#6b7280;">
                    Este código expira en <strong>10 minutos</strong>.
                </p>
            """

            yag.send(
                to=correo_receptor,
                subject='Verificación de correo electrónico',
                contents=contenido
            )
            return True
        except Exception as e:
            print(f'Error enviando correo: {e}')
            return False
        
# endpoint para verificar código
class VerificarCodigo(APIView):
    def post(self, request):
        # Obtener el código del cuerpo de la solicitud
        codigo_introducido = request.data.get('codigo')

        # Validar que el código no esté vacío
        if not codigo_introducido:
            return Response({'Error': 'Código no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar que el código no haya expirado
        expira_str = request.session.get('expira')
        if not expira_str or datetime.fromisoformat(expira_str) < datetime.now():
            return Response({'Error': 'El código ha expirado. Solicita uno nuevo.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar que el codigo sea igual al de la sesión
        if str(codigo_introducido) == str(request.session.get('codigo_verificacion')):
            del request.session['codigo_verificacion']
            return Response({'exito': 1}, status=status.HTTP_200_OK)
        return Response({'Error': 0}, status=status.HTTP_406_NOT_ACCEPTABLE)

# endpoint para crear usuario
class CrearUsuario(APIView):
    def post(self, request):
        # Validar los datos recibidos usando el serializer
        serializer = UsuarioSerializer(data=request.data.get('data'))
        
        if not serializer.is_valid():
            print('error en el serailizer')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Si los datos son válidos, los extraemos de validated_data
        nombre = serializer.validated_data.get('nombre')
        apellido = serializer.validated_data.get('apellido')
        fecha_nacimiento = serializer.validated_data.get('fechaNacimiento')
        correo = serializer.validated_data.get('email')
        clave = serializer.validated_data.get('password')

        # Hashear la clave
        clave_hasheada = make_password(clave)

        try:
            with connection.cursor() as cursor:
                # Usar la sintaxis CALL o SELECT para invocar la función
                # Se espera que la función devuelva un solo valor (el ID)
                cursor.execute(
                    "SELECT datos_usuario.crear_usuario(%s, %s, %s, %s, %s)",
                    [nombre, apellido, fecha_nacimiento, correo, clave_hasheada]
                )
                id_usuario = cursor.fetchone()[0]

                request.session['usuario'] = id_usuario

            return Response({
                'id': id_usuario, 
                'mensaje': 'Usuario registrado exitosamente'
            }, status=status.HTTP_201_CREATED)

        except UniqueViolation:
            # Captura el error específico de la base de datos
            return Response({
                'Error': 'El correo electrónico ya se encuentra registrado.'
            }, status=status.HTTP_409_CONFLICT) # Código 409: Conflict es más apropiado para duplicados
            
        except DatabaseError as e:
            if hasattr(e.args[0], 'pgcode') and e.args[0].pgcode == '23505':
                # 2. Si el código coincide, es una violación de unicidad
                return Response({
                    'Error': 'El correo electrónico ya se encuentra registrado.'
                }, status=status.HTTP_409_CONFLICT)
            else:
                # 3. Si no es una violación de unicidad, maneja el error genérico
                return Response({
                    'Error': f"Ha ocurrido un error inesperado en la base de datos: {str(e)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
from django.middleware.csrf import get_token

# endpoint para login
class LoginView(APIView):
    def post(self, request):
        # Validar los datos recibidos usando el serializer
        correo = request.data.get("correo")
        clave = request.data.get("clave")

        # Validaciones básicas
        if not correo or not clave:
            return Response({"error": "Correo y clave son requeridos"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Consultar la base de datos
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM datos_usuario.login(%s)", [correo])
                resultado = cursor.fetchone()

                # Validar resultado
                if not resultado:
                    return Response({"error": "Usuario no encontrado"},
                                    status=status.HTTP_404_NOT_FOUND)
                
                # desempaquetar resultado
                clave_hasheada, rol = resultado[0], resultado[1]

                # Validar clave
                if not check_password(clave, clave_hasheada):
                    return Response({"error": "Credenciales inválidas"},
                                    status=status.HTTP_401_UNAUTHORIZED)

                # ✅ Guardar en sesión
                request.session["usuario"] = {
                    "correo": correo,
                    "rol": rol
                }
                request.session["expira"] = (datetime.now() + timedelta(minutes=30)).isoformat()

                # ✅ Refrescar CSRF token para frontend
                csrf_token = get_token(request)

                return Response({
                    "exito": "Inicio de sesión exitoso",
                    "usuario": {"correo": correo, "rol": rol},
                    "csrfToken": csrf_token   # el front puede guardarlo
                }, status=status.HTTP_200_OK)

        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# endpoint para obtener perfil
class PerfilView(APIView):
    def get(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            "correo": usuario["correo"],
            "rol": usuario["rol"]
        }, status=status.HTTP_200_OK)
    
class ObtenerProductos(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM datos_tienda.obtener_productos()")
                productos = cursor.fetchall()

                # Convertir los resultados a una lista de diccionarios
                lista_productos = []
                for producto in productos:
                    lista_productos.append({
                        "id": producto[0],
                        "nombre": producto[1],
                        "descripcion": producto[2],
                        "precio": float(producto[3]),
                        "imagen_url": producto[4],
                        "categoria": producto[5]
                    })

                return Response(lista_productos, status=status.HTTP_200_OK)

        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class AdminOnlyView(APIView):
    def get(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        if usuario["rol"] != "admin":
            return Response({"error": "Acceso denegado"}, status=status.HTTP_403_FORBIDDEN)

        return Response({"mensaje": "Bienvenido, admin!"}, status=status.HTTP_200_OK)
    
# View para crear un carrito al usuario
class CrearCarritoView(APIView):
    def post(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT datos_tienda.crear_carrito((SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s))", [usuario["correo"]])
                id_carrito = cursor.fetchone()[0]

                return Response({
                    "id_carrito": id_carrito,
                    "mensaje": "Carrito creado exitosamente"
                }, status=status.HTTP_201_CREATED)

        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# View para agregar un item al carrito
class AgregarItemCarritoView(APIView):
    def post(self, request):
        usuario = request.session.get("usuario")
        id_producto = request.data.get("id_producto")
        cantidad = request.data.get("cantidad", 1)

        if not usuario:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        if not id_producto or cantidad <= 0:
            return Response({"error": "ID de producto y cantidad válidos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                # Obtener el id del carrito del usuario
                cursor.execute("SELECT id_carrito FROM datos_tienda.carritos WHERE usuario_fk = (SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s)", [usuario["correo"]])
                resultado = cursor.fetchone()

                if not resultado:
                    return Response({"error": "El usuario no tiene un carrito. Crea uno primero."}, status=status.HTTP_404_NOT_FOUND)

                id_carrito = resultado[0]

                # Agregar el item al carrito
                cursor.execute("SELECT datos_tienda.registrar_item_carrito(%s, %s, %s)", [id_carrito, id_producto, cantidad])
                exito = cursor.fetchone()[0]

                if exito:
                    return Response({"mensaje": "Item agregado al carrito exitosamente"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "No se pudo agregar el item al carrito"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# View para ver los items del carrito
class VerCarritoView(APIView):
    def get(self, request):
        usuario = request.session.get("usuario")
        print(usuario)

        if not usuario:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                # Obtener el id del carrito del usuario
                cursor.execute("SELECT id_carrito FROM datos_tienda.carritos WHERE usuario_fk = (SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s)", [usuario["correo"]])
                resultado = cursor.fetchone()

                if not resultado:
                    CrearCarritoView.post(self, request)

                id_carrito = resultado[0]

                # Obtener los items del carrito
                cursor.execute("""
                    SELECT p.id_producto, p.nombre, p.descripcion, p.precio, ic.cantidad
                    FROM datos_tienda.items_carrito ic
                    JOIN datos_tienda.productos p ON ic.producto_fk = p.id_producto
                    WHERE ic.carrito_fk = %s
                """, [id_carrito])
                items = cursor.fetchall()

                lista_items = []
                for item in items:
                    lista_items.append({
                        "id_producto": item[0],
                        "nombre": item[1],
                        "descripcion": item[2],
                        "precio": float(item[3]),
                        "cantidad": item[4]
                    })

                return Response({
                    "id_carrito": id_carrito,
                    "items": lista_items
                }, status=status.HTTP_200_OK)

        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# endpoint para actualizar un item en el carrito
class ActualizarItemView(APIView):
    def put(self, request):
        usuario = request.session.get("usuario")
        id_producto = request.data.get("id_producto")
        nueva_cantidad = request.data.get("cantidad")

        print(id_producto)
        print(nueva_cantidad)

        if not usuario:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        if not id_producto or nueva_cantidad <= 0:
            return Response({"error": "ID de producto y cantidad válidos son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                # Obtener el id del carrito del usuario
                cursor.execute("SELECT id_carrito FROM datos_tienda.carritos WHERE usuario_fk = (SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s)", [usuario["correo"]])
                resultado = cursor.fetchone()

                if not resultado:
                    return Response({"error": "El usuario no tiene un carrito. Crea uno primero."}, status=status.HTTP_404_NOT_FOUND)

                id_carrito = resultado[0]

                # Actualizar la cantidad del item en el carrito
                cursor.execute("SELECT * FROM datos_tienda.actualizar_item_carrito(%s, %s, %s)", [id_producto, nueva_cantidad, id_carrito])
                exito = cursor.fetchone()[0]

                if not exito:
                    return Response({"error": "No se pudo actualizar el item. Verifica que el producto exista en el carrito."}, status=status.HTTP_400_BAD_REQUEST)

                return Response({"mensaje": "Item actualizado exitosamente"}, status=status.HTTP_200_OK)

        except DatabaseError as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# endpoint para eliminar un item del carrito
class EliminarItemView(APIView):
    def delete(self, request):
        usuario = request.session.get("usuario")
        id_producto = request.data.get("id_producto")

        if not usuario:
            return Response({"error": "No autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        if not id_producto:
            return Response({"error": "ID de producto válido es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                # Obtener el id del carrito del usuario
                cursor.execute("SELECT id_carrito FROM datos_tienda.carritos WHERE usuario_fk = (SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s)", [usuario["correo"]])
                resultado = cursor.fetchone()

                if not resultado:
                    return Response({"error": "El usuario no tiene un carrito. Crea uno primero."}, status=status.HTTP_404_NOT_FOUND)

                id_carrito = resultado[0]

                # Eliminar el item del carrito
                cursor.execute("SELECT * FROM datos_tienda.eliminar_item_carrito(%s, %s)", [id_producto, id_carrito])
                exito = cursor.fetchone()[0]

                if not exito:
                    return Response({"error": "No se pudo eliminar el item. Verifica que el producto exista en el carrito."}, status=status.HTTP_400_BAD_REQUEST)

                return Response({"mensaje": "Item eliminado exitosamente"}, status=status.HTTP_200_OK)

        except DatabaseError as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# endpoint para obtener las direcciones del usuario
class DireccionesView(APIView):
    def get(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM datos_usuario.obtener_direcciones_permitidas()")
                direcciones = cursor.fetchall()

                lista_direcciones = []
                for direccion in direcciones:
                    lista_direcciones.append({
                        "parroquia_id": direccion[0],
                        "parroquia": direccion[1],
                        "municipio_id": direccion[2],
                        "municipio": direccion[3],
                        "estado_id": direccion[4],
                        "estado": direccion[5]
                    })

                return Response(lista_direcciones, status=status.HTTP_200_OK)
        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # endpont para agregar una direccion
    def post(self, request):
        usuario = request.session.get('usuario')

        if not usuario:
            return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        alias = request.data.get("alias")
        direccion = request.data.get("direccion_completa")
        parroquia_id = request.data.get("parroquia_id")

        try:
            with connection.cursor() as cursor:
                # Obtener el id del usuario usando el correo
                cursor.execute("SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s", [usuario["correo"]])
                resultado_usuario = cursor.fetchone()

                if not resultado_usuario:
                    return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

                id_usuario = resultado_usuario[0]

                # Registrar la dirección
                cursor.execute(
                    "SELECT * FROM datos_usuario.registrar_direccion(%s, %s, %s, %s)",
                    [direccion, parroquia_id, id_usuario, alias]
                )
                resultado = cursor.fetchone()

                if resultado:
                    return Response({"Exito": "La direccion ha sido ingresada exitosamente"}, status=200)
                else:
                    return Response({"error": "No se pudo registrar la dirección"}, status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# endpoint para obtener las direcciones de usuario
class DireccionesUsuarioView(APIView):
    def get(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                # Obtener el id del usuario usando el correo
                cursor.execute("SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s", [usuario["correo"]])
                resultado_usuario = cursor.fetchone()

                if not resultado_usuario:
                    return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

                id_usuario = resultado_usuario[0]

                # Llamar a la función SQL para obtener las direcciones del usuario
                cursor.execute("SELECT * FROM datos_usuario.obtener_direcciones_por_usuario(%s)", [id_usuario])
                direcciones = cursor.fetchall()

                lista_direcciones = []
                for direccion in direcciones:
                    lista_direcciones.append({
                        "id_direccion": direccion[0],
                        "direccion_completa": direccion[1],
                        "parroquia_fk": direccion[2],
                        "usuario_fk": direccion[3],
                        "alias": direccion[5],
                        "mensaje": direccion[4]
                    })

                return Response(lista_direcciones, status=status.HTTP_200_OK)
        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def put(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
        
        alias_new = request.data.get('alias')
        direccion_c_new = request.data.get('direccion_completa')
        parroquia_new = request.data.get('parroquia_id')
        direccion_id = request.data.get('id_direccion')
        
        try:
            with connection.cursor() as cursor:
                # Obtener el id del usuario usando el correo
                cursor.execute("SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s", [usuario["correo"]])
                resultado_usuario = cursor.fetchone()

                if not resultado_usuario:
                    return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

                id_usuario = resultado_usuario[0]

                cursor.execute("SELECT * FROM datos_usuario.editar_direccion_usuario(%s, %s, %s, %s, %s)", [direccion_id, id_usuario, direccion_c_new, parroquia_new, alias_new])

                resultado = cursor.fetchone()[0]

                if resultado:
                    return Response({"Exito": "La direccion ha sido editada exitosamente."}, status=200)
                
                return Response({"Error": "Ha ocurrido un error al editar la direccion. Por favor intente nuevamente."}, status=400)
        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
        
        direccion_id = request.data.get('id_direccion')

        try:
            with connection.cursor() as cursor:
                # Obtener el id del usuario usando el correo
                cursor.execute("SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s", [usuario["correo"]])
                resultado_usuario = cursor.fetchone()

                if not resultado_usuario:
                    return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

                id_usuario = resultado_usuario[0]

                cursor.execute("SELECT * FROM datos_usuario.eliminar_direccion_usuario(%s, %s)", [direccion_id, id_usuario])

                resultado = cursor.fetchone()[0]

                if resultado:
                    return Response({"Exito": "La direccion ha sido eliminada exitosamente."}, status=200)
                
                return Response({"Error": "Ha ocurrido un error al eliminar la direccion. Por favor intente nuevamente."}, status=400)
        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PagoView(APIView):
    def post(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)
        

        pago = request.data.get("total")
        pago_total = float(pago) + (float(pago) * 0.16)
        estado = "Procesando"
        comprobante = request.FILES.get("receipt")
        direccion = request.data.get("address_id")
        metodo = request.data.get("method")
        num_ref = request.data.get("reference_number")
        correo_origen = request.data.get("source_email")

        tiempoTemp = datetime.now()
        nombre_relativo = tiempoTemp.strftime("%Y-%m-%d_%H-%M-%S")
        extension = comprobante.name.split('.')[-1].lower()

        if not comprobante:
            return Response({"Error": "Imagen no proporcionada"}, status=400)
        
        ruta_relativa = f"imagenes/{nombre_relativo}.{extension}"
        ruta_absoluta = os.path.join(settings.MEDIA_ROOT, ruta_relativa)

        try:
            with connection.cursor() as cursor:
                # Obtener el id del usuario usando el correo
                cursor.execute("SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s", [usuario["correo"]])
                resultado_usuario = cursor.fetchone()

                if not resultado_usuario:
                    return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

                id_usuario = resultado_usuario[0]

                cursor.execute("SELECT * FROM datos_tienda.crear_orden(%s, %s, %s, %s, %s, %s, %s, %s)", [id_usuario, estado, pago_total, direccion, ruta_absoluta, metodo, num_ref, correo_origen])

                resultado = cursor.fetchone()[0]

                if resultado:
                    default_storage.save(ruta_relativa, ContentFile(comprobante.read()))

                    items_string = request.data.get("items")
                    items = json.loads(items_string)

                    for item in items:
                        precio_unitario = item['pco'] + (item['pco'] * 0.16)

                        cursor.execute("SELECT * FROM datos_tienda.registrar_items(%s, %s, %s, %s)", [resultado, item['id'], item['qty'], precio_unitario])
                        
                        cursor.execute("SELECT * FROM datos_tienda.carritos WHERE usuario_fk = %s", [id_usuario])
                        id_carrito = cursor.fetchone()[0]

                        cursor.execute("SELECT * FROM datos_tienda.eliminar_item_carrito(%s, %s)", [item['id'], id_carrito])
                        resultado2 = cursor.fetchone()[0]

                    if resultado2:
                        return Response({"Exito": "La orden fue procesada exitosamente"}, status=200)

        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UltimaCompraView(APIView):
    def get(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                # Obtener el id del usuario usando el correo
                cursor.execute("SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s", [usuario["correo"]])
                resultado_usuario = cursor.fetchone()

                if not resultado_usuario:
                    return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

                id_usuario = resultado_usuario[0]

                # Llamar a la función SQL para obtener la última compra
                cursor.execute("SELECT * FROM datos_tienda.obtener_ultima_compra(%s)", [id_usuario])
                ultima_compra = cursor.fetchone()

                print(ultima_compra)

                if not ultima_compra:
                    return Response({"mensaje": "No se encontraron compras para este usuario."}, status=status.HTTP_404_NOT_FOUND)

                # Formatear la respuesta
                compra_formateada = {
                    "id": ultima_compra[0],
                    "fecha": ultima_compra[1].strftime('%Y-%m-%d'),
                    "total": float(ultima_compra[2]),
                    "estado": ultima_compra[3]
                }

                return Response(compra_formateada, status=status.HTTP_200_OK)

        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ObtenerOrdenesUsuarioView(APIView):
    def get(self, request):
        usuario = request.session.get("usuario")

        if not usuario:
            return Response({"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            with connection.cursor() as cursor:
                # Obtener el id del usuario usando el correo
                cursor.execute("SELECT id_usuario FROM datos_usuario.usuarios WHERE correo = %s", [usuario["correo"]])
                resultado_usuario = cursor.fetchone()

                if not resultado_usuario:
                    return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

                id_usuario = resultado_usuario[0]

                # Llamar a la función SQL para obtener las órdenes del usuario
                cursor.execute("SELECT * FROM datos_tienda.obtener_ordenes_usuario(%s)", [id_usuario])
                ordenes = cursor.fetchall()

                lista_ordenes = []
                for orden in ordenes:
                    lista_ordenes.append({
                        "id_orden": orden[0],
                        "fecha": orden[1].strftime('%Y-%m-%d'),
                        "estado": orden[2],
                        "total": float(orden[3]),
                        "direccion": orden[4],
                        "metodo": orden[5],
                        "referencia": orden[6]
                    })

                return Response(lista_ordenes, status=status.HTTP_200_OK)

        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CerrarSesionView(APIView):
    def post(self, request):
        try:
            request.session.flush()
            return Response({"mensaje": "Sesión cerrada exitosamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)