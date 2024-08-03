from rest_framework import serializers
from custom_user.models import User, Client, Category, Product, Order, OrderItem


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            product_id = item_data['product'].id
            product = Product.objects.get(id=product_id)
            if product.quantity >= item_data['quantity']:
                product.quantity -= item_data['quantity']
                product.save()
                OrderItem.objects.create(order=order, **item_data)
            else:
                raise serializers.ValidationError(f'Insufficient quantity for product {product.name}')
        
        return order



