# Generated by Django 5.0.6 on 2024-06-14 22:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_user', '0004_product_local'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.TextField(default='https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'),
        ),
    ]
