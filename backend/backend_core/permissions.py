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
        
        # Cek di database DAN di whitelist .env
        allowed_emails_str = os.getenv('ALLOWED_MEMBER_EMAILS', '')
        allowed_emails = [e.strip().lower() for e in allowed_emails_str.split(',') if e.strip()]
        
        user_email = request.user.email.lower().strip()
        
        is_in_whitelist = user_email in allowed_emails
        is_in_db = Member.objects.filter(email=user_email).exists()
        
        return is_in_whitelist or is_in_db