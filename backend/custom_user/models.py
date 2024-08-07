from django_use_email_as_username.models import BaseUser, BaseUserManager  # type: ignore
from django.db import models


class User(BaseUser):  # noqa: DJ08
    objects = BaseUserManager()


class Client(models.Model):
    dni = models.CharField(max_length=20, unique=True, blank=True, null=True)
    user = models.ForeignKey(User, related_name='clients', on_delete=models.CASCADE)
    direction = models.CharField(max_length=255, blank=True, null=True)
    cellphone = models.CharField(max_length=15, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.dni


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name


LOCALS = (
    ('0', 'Ceibos'),
    ('1', 'Entre_Rios'),
    ('2', 'CCT_terrestre'),
    ('3', 'Entregado'),
    ('4', 'Paseo_Shopping_Machala'),
)


class Product(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    category = models.ForeignKey(Category, related_name='products', on_delete=models.SET_NULL, null=True)
    date_added = models.DateField()
    local = models.CharField(max_length=20, default='Ceibos', choices=LOCALS)
    image = models.TextField(default='https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png')
    details = models.TextField(blank=True, default='')
    def __str__(self):
        return self.name


STATUS = (
    ('0', 'Pending'),
    ('1', 'Procesando'),
    ('2', 'Enviado'),
    ('3', 'Entregado'),
    ('4', 'Cancelado'),
)


class Order(models.Model):
    client = models.ForeignKey(Client, related_name='orders', on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='Pending', choices=STATUS)
    date_created = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.total


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return self.order

class WishlistItem(models.Model):
    user = models.ForeignKey(User, related_name='wishlist', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='wishlist_items', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f'{self.user.email} - {self.product.name}'