from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet, OrderViewSet, create_order, signup
from . import views

router = DefaultRouter()
router.register(r'menu-items', MenuItemViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/signup/', signup, name='signup'),
    path('api/staff-login/', views.staff_login, name='staff_login'),
    path('api/staff/orders/', views.StaffOrderListAPIView.as_view(), name='staff-order-list'),
    path('api/staff/orders/<int:pk>/complete/', views.MarkOrderCompletedAPIView.as_view(), name='mark-order-complete'),
    path('api/orders/', create_order, name='create_order'),
]
