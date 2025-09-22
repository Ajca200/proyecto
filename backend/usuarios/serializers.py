from rest_framework import serializers

# Serializador para validar y procesar los datos
class UsuarioSerializer(serializers.Serializer):
    nombre = serializers.CharField(required=True, max_length=100)
    apellido = serializers.CharField(required=True, max_length=100)
    fechaNacimiento = serializers.DateField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True) # write_only para no mostrar la clave en las respuestas

class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField(required=True)
    clave = serializers.CharField(required=True)