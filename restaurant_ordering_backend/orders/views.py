from rest_framework import viewsets
from .models import MenuItem, Order
from .serializers import MenuItemSerializer, OrderSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import ValidationError
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem
from django.shortcuts import get_object_or_404
from datetime import datetime
from .models import Order
from .serializers import OrderSerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class StaffOrderListAPIView(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        return self.queryset.filter(completed=False)  # Only show orders that are not completed

class MarkOrderCompletedAPIView(generics.UpdateAPIView):
    queryset = Order.objects.all()

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.completed = True
        instance.save()
        return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        validate_password(password)
    except ValidationError as e:
        return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def staff_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        # Redirect to staff page or send some specific response
        return Response({'message': 'Staff login successful'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials or not authorized'}, status=status.HTTP_401_UNAUTHORIZED)


# @api_view(['POST'])
# def create_order(request):
#     table_number = request.data.get('table_number')
#     total_amount = request.data.get('total_amount')
#     items = request.data.get('items', [])

#     # Create Order instance
#     order = Order.objects.create(
#         table_number=table_number,
#         total_amount=total_amount,
#         created_at=datetime.now(),  # Assuming you have a created_at field in your model
#     )

#     # Create OrderItem instances
#     for item in items:
#         menu_item_id = item.get('menu_item')
#         quantity = item.get('quantity')
#         sub_total = item.get('sub_total')
#         menu_item = get_object_or_404(MenuItem, pk=menu_item_id)  # Assuming MenuItem model exists

#         OrderItem.objects.create(
#             order=order,
#             menu_item=menu_item,
#             quantity=quantity,
#             sub_total=sub_total,
#         )

#     return Response({'message': 'Order placed successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def create_order(request):
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        # Associate order with customer (example assuming customer ID is passed in request)
        serializer.save(customer_id=request.user.id)  # Adjust as per your authentication setup
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
