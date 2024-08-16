from behave import then
from tests.factories import ProductFactory
from custom_user.models import Product

@then('I should receive a "{status_code}" status')
def step_then_should_receive_status(context, status_code):
    assert str(context.response.status_code) == status_code, f"Expected {status_code}, but got {context.response.status_code}"

@then('I should see an error message "{message}"')
def step_then_should_see_error_message(context, message):
    assert message in context.response.json().get('error', ''), f"Expected error message '{message}', but got '{context.response.json().get('error', '')}'"

@then('the product should be created')
def step_then_product_should_be_created(context):
    assert context.response.status_code == 201, f"Expected 201 Created, but got {context.response.status_code}"
    created_product = Product.objects.filter(name=context.response.json().get('name')).exists()
    assert created_product, "Expected product to be created, but it does not exist"

@then('I should receive a confirmation message')
def step_then_should_receive_confirmation_message(context):
    assert "confirmation" in context.response.json(), "Expected a confirmation message, but didn't find one"

@then('the product\'s name should be updated')
def step_then_product_name_should_be_updated(context):
    context.product.refresh_from_db()
    assert context.product.name == "Updated Product", f"Expected product name to be 'Updated Product', but got '{context.product.name}'"

@then('the product should no longer exist')
def step_then_product_should_no_longer_exist(context):
    assert not Product.objects.filter(id=context.product.id).exists(), "Expected product to be deleted, but it still exists"

@then('I should see the product "{product_name}"')
def step_then_should_see_product(context, product_name):
    assert product_name in context.response.content.decode(), f"Expected to see {product_name}, but it was not found"


@then('I should see a confirmation message "Correo enviado exitosamente"')
def step_then_should_see_contact_confirmation_message(context):
    assert "Correo enviado exitosamente" in context.response.content.decode(), "Expected confirmation message, but it was not found"
