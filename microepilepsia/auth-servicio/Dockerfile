# Imagen base
FROM python:3.11-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código fuente
COPY . .

# Exponer el puerto de Django
EXPOSE 8000

# Comando para iniciar Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
