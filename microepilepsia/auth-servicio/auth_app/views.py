import jwt
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

SECRET_KEY = "clave-simulada"

VALID_KEYS = {
    "clave-secreta-super123": "medico",
    "token-admin-456": "admin",
    "acceso-invitado-789": "invitado"
}

TOKEN_DURATION_MINUTES = 30

@api_view(['POST'])
def key_auth_view(request):
    access_key = request.data.get("access_key")
    role = VALID_KEYS.get(access_key)

    if not role:
        return Response({"error": "Llave inválida"}, status=status.HTTP_401_UNAUTHORIZED)

    expiration = datetime.utcnow() + timedelta(minutes=TOKEN_DURATION_MINUTES)
    token_payload = {
        "role": role,
        "exp": expiration.timestamp()
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")
    return Response({"token": token, "role": role})


@api_view(['GET'])
def validate_view(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"error": "Token faltante o mal formado"}, status=401)

    token = auth_header.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return Response({"valid": True, "role": payload["role"]})
    except jwt.ExpiredSignatureError:
        return Response({"valid": False, "error": "Token expirado"}, status=401)
    except jwt.InvalidTokenError:
        return Response({"valid": False, "error": "Token inválido"}, status=401)
