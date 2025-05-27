from django.db import models

class Paciente(models.Model):
    nombre = models.CharField(max_length=100)
    edad = models.IntegerField()
    genero = models.CharField(max_length=10)
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre
