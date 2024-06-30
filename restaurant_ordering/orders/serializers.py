from rest_framework import serializers
from .models import MenuItem, Order, OrderItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('menu_item', 'quantity', 'sub_total')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'customer_id', 'table_number', 'total_amount', 'items')
        # Add 'customer_id' to the fields list to allow it to be set from frontend

    # Ensure 'customer_id' is included in validated_data
    def create(self, validated_data):
        customer_id = validated_data.pop('customer_id')
        order = Order.objects.create(customer_id=customer_id, **validated_data)
        return order
