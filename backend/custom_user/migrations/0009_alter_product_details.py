# Generated by Django 5.0.6 on 2024-08-16 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_user', '0008_product_details'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='details',
            field=models.TextField(default='No hay detalles'),
        ),
    ]
