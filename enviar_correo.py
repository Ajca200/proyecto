import yagmail
yag = yagmail.SMTP('colmenaresabrahan5f@gmail.com', 'mbpx epge izld tlpg')
codigo_verificacion = '128991'  # Puedes cambiarlo dinámicamente

contenido = f"""
  <p style="font-size:16px; margin: 0px;">
    Hola 👋, gracias por registrarte en <strong>Mis Viejos</strong>.
  </p>
  <p style="font-size:14px; margin:0; line-height:1.2;">
    Tu código de verificación es:
  </p>
  <p style="font-size:22px; font-weight:bold; letter-spacing:4px; color:#2563eb;">
    {codigo_verificacion}
  </p>
  <p style="font-size:12px; color:#6b7280;">
    Este código expira en <strong>10 minutos</strong>.  
    Si no solicitaste este registro, ignora este mensaje.
  </p>
"""


yag.send(
    to='colmenaresabrahan5f@gmail.com',
    subject='Verificación de correo electrónico',
    contents=contenido
)
print('Correo enviado')
