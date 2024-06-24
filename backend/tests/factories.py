
import factory
from factory import Faker
from factory.django import DjangoModelFactory
from custom_user.models import User, Client, Category, Product, Order, OrderItem,LOCALS,STATUS
from django_use_email_as_username.models import BaseUserManager
from django.utils import timezone


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    id = factory.Sequence(lambda n: n + 1)
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.Faker('email')
    password = factory.Faker('password')

    is_superuser = False
    is_staff = False
    is_active = True

    date_joined = factory.Faker('date_time_this_month',tzinfo=timezone.get_current_timezone())


class ClientFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Client

    id = factory.Sequence(lambda n: n + 1)
    dni = factory.Sequence(lambda n: f'DNI-{n}')
    direction = factory.Faker('address')
    
    cellphone = factory.Faker('numerify', text='+' + '#' * 14) 
    city = factory.Faker('city')
    user = factory.SubFactory(UserFactory)
   


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category

    id = factory.Sequence(lambda n: n + 1)
    name = factory.Sequence(lambda n: f'Category {n}')
    description = factory.Faker('text')

class OrderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Order

    id = factory.Sequence(lambda n: n + 1)
    total = factory.Faker('pydecimal', left_digits=5, right_digits=2, positive=True)
    status = factory.Iterator(['0', '1', '2', '3', '4'])
    client = factory.SubFactory(ClientFactory)
    date_created = factory.Faker('date_time_this_year',tzinfo=timezone.get_current_timezone())
    date_update = factory.Faker('date_time_between_dates', datetime_start=factory.SelfAttribute('..date_created'),tzinfo=timezone.get_current_timezone())

class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product
    id = factory.Sequence(lambda n: n + 1)

    name = factory.Sequence(lambda n: f'Product {n}')
    description = factory.Faker('text')
    price = factory.Faker('pydecimal', left_digits=4, right_digits=2, positive=True)
    quantity = factory.Faker('random_int', min=1, max=100)
    category = factory.SubFactory(CategoryFactory)
    date_added = factory.Faker('date_time_this_year',tzinfo=timezone.get_current_timezone())
    local = factory.Iterator(['0', '1', '2', '3', '4'])
    image = factory.Faker('image_url')

class OrderItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrderItem

    order = factory.SubFactory(OrderFactory)
    product = factory.SubFactory(ProductFactory)
    quantity = factory.Faker('random_int', min=1, max=10)
