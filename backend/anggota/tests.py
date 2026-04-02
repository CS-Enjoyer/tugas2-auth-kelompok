from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Member
import os
from unittest.mock import patch

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

        # User 3: User Whitelist (TIDAK ada di DB, tapi ada di .env)
        self.whitelist_user = User.objects.create_user(username='whitelist', email='whitelist@example.com', password='password')

    def test_theme_update_by_admin(self):
        """Test: Admin (email terdaftar di table Member) bisa mengakses API ganti tema"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/update-theme/', {'color': '#ff0000', 'font': 'Arial'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch.dict(os.environ, {"ALLOWED_MEMBER_EMAILS": "whitelist@example.com,other@test.com"})
    def test_theme_update_by_whitelist(self):
        """Test: User yang emailnya ada di whitelist .env bisa mengakses API meskipun tidak ada di DB"""
        self.client.force_authenticate(user=self.whitelist_user)
        response = self.client.post('/api/update-theme/', {'color': '#112233', 'font': 'Fira Code'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_theme_update_by_guest(self):
        """Test: Tamu dilarang mengakses API ganti tema"""
        self.client.force_authenticate(user=self.guest_user)
        response = self.client.post('/api/update-theme/', {'color': '#00ff00', 'font': 'Verdana'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class MemberApiTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        Member.objects.create(name="Member A", email="a@test.com", student_id="001")
        Member.objects.create(name="Member B", email="b@test.com", student_id="002")

    def test_get_member_list(self):
        """Test: Mendapatkan daftar anggota bio-grid"""
        response = self.client.get('/api/members/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Menyesuaikan dengan format DRF (bisa berupa list langsung atau paginated dict)
        data = response.data.get('results') if isinstance(response.data, dict) else response.data
        self.assertTrue(len(data) >= 2)
