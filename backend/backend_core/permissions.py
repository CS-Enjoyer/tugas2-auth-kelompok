# import os
# from rest_framework import permissions
# from anggota.models import Member

# class IsGroupMember(permissions.BasePermission):
#     """
#     Hanya mengizinkan akses jika email user ada di daftar ALLOWED_MEMBER_EMAILS di .env
#     """
#     def has_permission(self, request, view):
#         # Cek apakah user sudah login
#         if not request.user or not request.user.is_authenticated:
#             return False
        
#         # Ambil daftar email dari .env
#         allowed_emails_str = os.getenv('ALLOWED_MEMBER_EMAILS', '')
#         allowed_emails = [email.strip() for email in allowed_emails_str.split(',')]
        
#         # Cek apakah email user yang login ada di daftar
#         return request.user.email in allowed_emails


import os
from rest_framework import permissions
from anggota.models import Member 

class IsGroupMember(permissions.BasePermission):
    """
    Hanya mengizinkan akses jika email user ada di dalam database tabel Member.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return Member.objects.filter(email=request.user.email).exists()