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
from .serializers import UsuarioSerializer, LoginSerializer
from django.shortcuts import redirect
from functools import wraps
from django.http import JsonResponse

def validar_sesion(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        # 1. Validar la existencia de la sesión
        if 'usuario' not in request.session:
            # Si no hay sesión, redirige al login
            return redirect('login') 
        
        # 2. Validar la expiración de la sesión
        expira_str = request.session.get('expira')
        if expira_str:
            expira_dt = datetime.fromisoformat(expira_str)
            if datetime.now() > expira_dt:
                # Si la sesión ha expirado, la limpiamos y redirigimos
                request.session.flush() 
                return redirect('login')
                
        # Si la sesión es válida, continúa con la vista original
        return view_func(request, *args, **kwargs)
        
    return _wrapped_view

def validar_admin(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        # Primero aseguramos que la sesión es válida
        if not validar_sesion(request):
            return redirect('login') # O la redirección que uses para el login
        
        # Validar el rol
        rol_usuario = request.session.get('usuario', {}).get('rol')
        if rol_usuario != 'admin': # Asume que el rol de admin es 'admin'
            # Si no es admin, puedes redirigirlo a otra página o mostrar un error
            return redirect('home') # O una página de acceso denegado
            
        return view_func(request, *args, **kwargs)
        
    return _wrapped_view

class EnviarCodigoVerificacion(APIView):
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'message': 'Correo no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generar un código seguro de 6 dígitos
        codigo_verificacion = str(secrets.randbelow(10**6)).zfill(6)
        
        # Enviar código
        if self.enviar_codigo(codigo_verificacion, email):
            request.session['codigo_verificacion'] = codigo_verificacion
            # request.session['email'] = email
            request.session['expira'] = (datetime.now() + timedelta(minutes=10)).isoformat()
            
            return Response({'message': 'Código enviado exitosamente'}, status=status.HTTP_200_OK)

        return Response({'message': 'Ha ocurrido un error al enviar el código. Intente más tarde.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        
class VerificarCodigo(APIView):
    def post(self, request):
        codigo_introducido = request.data.get('codigo')

        if str(codigo_introducido) == str(request.session.get('codigo_verificacion')):
            del request.session['codigo_verificacion']
            return Response({'exito': 1}, status=status.HTTP_200_OK)
        return Response({'Error': 0}, status=status.HTTP_406_NOT_ACCEPTABLE)

class CrearUsuario(APIView):
    def post(self, request):
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
            
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection, DatabaseError
from django.contrib.auth.hashers import check_password
from datetime import datetime, timedelta

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        correo = serializer.validated_data.get('correo')
        clave = serializer.validated_data.get('clave')

        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM datos_usuario.login(%s)", [correo])
                resultado = cursor.fetchone()

                if resultado:
                    clave_hasheada = resultado[0]
                    rol = resultado[1]

                    if check_password(clave, clave_hasheada):
                        # Guardar datos en sesión
                        request.session['usuario'] = {
                            'correo': correo,
                            'rol': rol
                        }
                        request.session['expira'] = (datetime.now() + timedelta(minutes=30)).isoformat()

                        return Response({
                            'exito': 'Inicio de sesión exitoso',
                            'usuario': {
                                'correo': correo,
                                'rol': rol
                            }
                        }, status=status.HTTP_200_OK)
                    
                    return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

                return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        except DatabaseError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EstadoSesion(APIView):
    def get(self, request):
        print(request.session.get('usuario'))
        if 'usuario' not in request.session:
            return JsonResponse({"autenticado": False})

        expira_str = request.session.get('expira')
        if expira_str:
            expira_dt = datetime.fromisoformat(expira_str)
            if datetime.now() > expira_dt:
                request.session.flush()
                return JsonResponse({"autenticado": False})

        usuario = request.session.get('usuario', {})
        return JsonResponse({
            "autenticado": True,
            "usuario": usuario,
            "rol": usuario.get("rol", "cliente")
        })

