from behave import given
from custom_user.models import Category
from tests.factories import CategoryFactory, UserFactory, ClientFactory, ProductFactory
from django.core.exceptions import ObjectDoesNotExist

@given('a product exists with a quantity of "{quantity}"')
def step_given_product_exists_with_quantity(context, quantity):
    context.user = UserFactory()
    context.product = ProductFactory(quantity=int(quantity))

@given('a user already exists with the email "{email}"')
def step_given_user_exists_with_email(context, email):
    context.user = UserFactory(email=email)
    ClientFactory(user=context.user)

@given('I am authenticated as an admin')
def step_given_authenticated_as_admin(context):
    context.admin_user = UserFactory(email="admin@example.com", password="adminpassword", is_superuser=True, is_staff=True)
    context.client.force_login(context.admin_user)

@given('a product exists with name "{name}"')
def step_given_product_exists_with_name(context, name):
    context.product = ProductFactory(name=name)

@given('a category named "{category_name}" exists')
def step_given_category_exists(context, category_name):
    context.category = CategoryFactory(name=category_name)

@given('a product exists with name "{product_name}" in the "{category_name}" category')
def step_given_product_in_category(context, product_name, category_name):
    
    try:
        category = Category.objects.get(name=category_name)
    except ObjectDoesNotExist:
        category = CategoryFactory(name=category_name)
    context.product = ProductFactory(name=product_name, category=category)
