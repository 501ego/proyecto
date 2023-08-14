from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=100, unique=True, verbose_name="Nombre de producto"
    )
    stock = models.IntegerField(verbose_name="Stock")
    unit_price = models.IntegerField(verbose_name="Precio unitario")
    add_date = models.DateField(verbose_name="Fecha de ingreso")
    expiration_date = models.DateField(verbose_name="Fecha de expiración")
    is_hidden = models.BooleanField(default=False, verbose_name="Oculto")

    def __str__(self):
        return str(self.id)


class Genre(models.Model):
    id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=50, verbose_name="Descripción")

    def __str__(self):
        return self.description


class Profile(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=50, verbose_name="Nombre de perfil"
    )

    def __str__(self):
        return self.name


class Region(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=50, verbose_name="Nombre de la región"
    )

    def __str__(self):
        return self.name


class City(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=50, verbose_name="Nombre de la ciudad"
    )
    id_region = models.ForeignKey(
        Region, on_delete=models.PROTECT, verbose_name="ID de la región"
    )

    def __str__(self):
        return self.name


class Commune(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=50, verbose_name="Nombre de la comuna"
    )
    id_city = models.ForeignKey(
        City, on_delete=models.PROTECT, verbose_name="ID de la ciudad"
    )

    def __str__(self):
        return self.name


class Person(models.Model):
    rut = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=50, verbose_name="Nombre")
    last_name = models.CharField(max_length=50, verbose_name="Apellido")
    id_genre = models.ForeignKey(
        Genre, on_delete=models.PROTECT, verbose_name="Género"
    )
    phone = models.CharField(max_length=20, blank=True,
                             null=True, verbose_name="Teléfono")
    email = models.EmailField(
        max_length=100, unique=True, null=True, blank=True, verbose_name="Correo electrónico"
    )
    street = models.CharField(max_length=50, verbose_name="Calle")
    id_region = models.ForeignKey(
        Region, on_delete=models.PROTECT, verbose_name="Región"
    )
    id_city = models.ForeignKey(
        City, on_delete=models.PROTECT, verbose_name="Ciudad"
    )
    id_commune = models.ForeignKey(
        Commune, on_delete=models.PROTECT, verbose_name="Comuna"
    )
    company_name = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Razón social"
    )
    giro = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Giro"
    )
    id_profile = models.ForeignKey(
        Profile, on_delete=models.PROTECT, null=True, blank=True, verbose_name="ID del perfil"
    )
    user = models.OneToOneField(
        User, on_delete=models.PROTECT, related_name='person', null=True, verbose_name="Usuario"
    )
    birth_date = models.DateField(
        blank=True, null=True, verbose_name="Fecha de nacimiento"
    )
    is_employee = models.BooleanField(default=False, verbose_name="Empleado")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    USERNAME_FIELD = 'rut'

    def __str__(self):
        return self.name + " " + self.last_name


class Document(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=50, unique=True, verbose_name="Nombre del documento"
    )

    def __str__(self):
        return self.name


class IVA(models.Model):
    id = models.AutoField(primary_key=True)
    value = models.FloatField(verbose_name="Porcentaje")
    is_active = models.BooleanField(default=True, verbose_name="Activo")

    def __str__(self):
        return str(self.value)


class Sale(models.Model):
    id = models.AutoField(primary_key=True)
    document = models.ForeignKey(
        Document, on_delete=models.PROTECT, verbose_name="ID del documento"
    )
    date = models.DateField(verbose_name="Fecha")
    hour = models.TimeField(verbose_name="Hora")
    total = models.IntegerField(verbose_name="Total")
    iva_value = models.ForeignKey(
        IVA, on_delete=models.PROTECT, verbose_name="Porcentaje del IVA"
    )
    seller = models.ForeignKey(
        Person, related_name='Seller', on_delete=models.PROTECT, null=False, verbose_name="Vendedor"
    )
    client = models.ForeignKey(
        Person, related_name='Client', on_delete=models.PROTECT, null=True, verbose_name="Cliente"
    )
    is_refund = models.BooleanField(default=False, verbose_name="Devolución")
    original_sale_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return str(self.id)


class SaleDetail(models.Model):
    id = models.AutoField(primary_key=True)
    id_product = models.ForeignKey(
        Product, on_delete=models.PROTECT, verbose_name="ID del producto"
    )
    product_quantity = models.IntegerField(
        verbose_name="Cantidad del producto"
    )
    unit_price = models.IntegerField(verbose_name="Precio unitario")
    subtotal = models.IntegerField(verbose_name="Subtotal")
    id_sale = models.ForeignKey(
        Sale, on_delete=models.PROTECT, verbose_name="ID de la venta"
    )
    original_sale_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return str(self.id)


class OpeningClosing(models.Model):
    id = models.AutoField(primary_key=True)
    opening_time = models.TimeField(
        null=True, blank=True, verbose_name="Hora de apertura")
    closing_time = models.TimeField(
        null=True, blank=True, verbose_name="Hora de cierre")
    date = models.DateField(verbose_name="Fecha")
    opening_employee = models.ForeignKey(
        Person, on_delete=models.PROTECT, verbose_name="Empleado que abrió", related_name='openings'
    )
    closing_employee = models.ForeignKey(
        Person, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Empleado que cerró", related_name='closings')
    is_open = models.BooleanField(
        default=False, verbose_name="¿Está abierto?")

    def __str__(self):
        return str(self.id)


class EmployeeRegister(models.Model):
    id = models.AutoField(primary_key=True)
    opening_time_sesion = models.TimeField(
        verbose_name="Hora de inicio de la sesión"
    )
    closing_time_sesion = models.TimeField(
        null=True, verbose_name="Hora de cierre de la sesión")
    date = models.DateField(verbose_name="Fecha")
    rut_employee = models.ForeignKey(
        Person, on_delete=models.PROTECT, verbose_name="Rut del empleado"
    )

    def __str__(self):
        return str(self.id)
