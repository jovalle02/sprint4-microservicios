import jwt
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Paciente
from .serializers import PacienteSerializer

SECRET = "clave-simulada"

def verificar_token(request):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return None
    token = auth.replace("Bearer ", "")
    try:
        return jwt.decode(token, SECRET, algorithms=["HS256"])
    except:
        return None

class ListaPacientes(APIView):
    def get(self, request):
        if not verificar_token(request):
            return Response({"error": "Token inválido"}, status=401)
        pacientes = Paciente.objects.all()
        serializer = PacienteSerializer(pacientes, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not verificar_token(request):
            return Response({"error": "Token inválido"}, status=401)
        serializer = PacienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
