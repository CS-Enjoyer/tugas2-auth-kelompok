from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Member

class MemberModelTest(TestCase):
    def setUp(self):
        self.member = Member.objects.create(
            name="Test member",
            email="test@example.com",
            student_id="123456"
        )

    def test_member_creation(self):
        """Test basis pembuatan model Member"""
        self.assertEqual(self.member.name, "Test member")
        self.assertEqual(self.member.email, "test@example.com")
        self.assertEqual(str(self.member), "Test member (123456)")

class ThemeUpdatePermissionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # User 1: Terdaftar sebagai Member (Admin)
        self.admin_user = User.objects.create_user(username='admin', email='admin@example.com', password='password123')
        Member.objects.create(name="Admin member", email="admin@example.com", student_id="A001")
        
        # User 2: User biasa (Tamu)
        self.guest_user = User.objects.create_user(username='guest', email='guest@example.com', password='password123')

    def test_theme_update_by_admin(self):
        """Test: Admin (email terdaftar di table Member) bisa mengakses API ganti tema"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/update-theme/', {'color': '#ff0000', 'font': 'Arial'}, format='json')
        
        # Sesuai logika di IsGroupMember, harusnya 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')

    def test_theme_update_by_guest(self):
        """Test: Tamu (email TIDAK terdaftar) dilarang mengakses API ganti tema"""
        self.client.force_authenticate(user=self.guest_user)
        response = self.client.post('/api/update-theme/', {'color': '#00ff00', 'font': 'Verdana'}, format='json')
        
        # Harus 403 Forbidden karena Permission Denied
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_theme_update_unauthenticated(self):
        """Test: User yang belum login dilarang mengakses API ganti tema"""
        response = self.client.post('/api/update-theme/', {'color': '#0000ff', 'font': 'Serif'}, format='json')
        # DRF mengembalikan 403 jika permission denied, termasuk untuk user anonim
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
