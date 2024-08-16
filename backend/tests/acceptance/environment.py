from django.test.client import Client

def before_scenario(context, scenario):
    context.client = Client()
