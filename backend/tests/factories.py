import factory
from factory.django import DjangoModelFactory
from custom_user.models import User, Client, Category, Product, Order, OrderItem, WishlistItem,LOCALS,STATUS

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    password = factory.PostGenerationMethodCall('set_password', 'defaultpassword')

class ClientFactory(DjangoModelFactory):
    class Meta:
        model = Client

    dni = factory.Faker('ssn')
    user = factory.SubFactory(UserFactory)
    direction = factory.Faker('address')
    cellphone = factory.Faker('numerify', text='###########') 
    city = factory.Faker('city')

class CategoryFactory(DjangoModelFactory):
    class Meta:
        model = Category

    name = factory.Faker('word')
    description = factory.Faker('text')

class ProductFactory(DjangoModelFactory):
    class Meta:
        model = Product

    name = factory.Faker('word')
    description = factory.Faker('text')
    price = factory.Faker('pydecimal', left_digits=5, right_digits=2, positive=True)
    quantity = factory.Faker('random_int', min=1, max=100)
    category = factory.SubFactory(CategoryFactory)
    date_added = factory.Faker('date')
    local = factory.Faker('random_element', elements=[choice[0] for choice in LOCALS])
    image = factory.Faker('image_url')
    details = factory.Faker('text')

class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order

    client = factory.SubFactory(ClientFactory)
    total = factory.Faker('pydecimal', left_digits=5, right_digits=2, positive=True)
    status = factory.Faker('random_element', elements=[choice[0] for choice in STATUS])
    date_created = factory.Faker('date_time_this_year')
    date_update = factory.Faker('date_time_this_year')

class OrderItemFactory(DjangoModelFactory):
    class Meta:
        model = OrderItem

    order = factory.SubFactory(OrderFactory)
    product = factory.SubFactory(ProductFactory)
    quantity = factory.Faker('random_int', min=1, max=10)

class WishlistItemFactory(DjangoModelFactory):
    class Meta:
        model = WishlistItem

    user = factory.SubFactory(UserFactory)
    product = factory.SubFactory(ProductFactory)
    added_at = factory.Faker('date_time_this_year')
