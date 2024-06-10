# Generated by Django 5.0.6 on 2024-06-04 03:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_user', '0002_category_client_order_product_orderitem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('0', 'Pending'), ('1', 'Procesando'), ('2', 'Enviado'), ('3', 'Entregado'), ('4', 'Cancelado')], default='Pending', max_length=20),
        ),
    ]
