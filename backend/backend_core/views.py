# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from .permissions import IsGroupMember
# from rest_framework.permissions import AllowAny

# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from allauth.socialaccount.providers.oauth2.client import OAuth2Client
# from dj_rest_auth.registration.views import SocialLoginView

# @method_decorator(csrf_exempt, name='dispatch')
# class ThemeUpdateView(APIView):
#     """
#     Endpoint untuk mengubah tema (Warna/Font).
#     Hanya bisa diakses jika:
#     1. User sudah Login via Google (Autentikasi)
#     2. Email user terdaftar sebagai Anggota (Otorisasi)
#     """
#     # permission_classes = [IsAuthenticated, IsGroupMember]

#     permission_classes = [AllowAny] 
#     authentication_classes = []

#     def post(self, request):
#         # Data warna/font yang dikirim dari React
#         new_color = request.data.get('color')
#         new_font = request.data.get('font')

#         # memastikan bahwa hanya 'whitelist' email yang bisa sampai ke sini
#         return Response({
#             "status": "success",
#             "message": f"Otorisasi Berhasil! Tema diubah ke {new_color} dengan font {new_font}.",
#             "user": request.user.email
#         })
    
# class GoogleLoginView(SocialLoginView):
#     """
#     View API yang akan menerima token dari React untuk ditukar dengan token Django.
#     """
#     adapter_class = GoogleOAuth2Adapter
#     # Sesuaikan port localhost jika React Anda menggunakan port berbeda (misal: 3000)
#     callback_url = "http://localhost:5173" 
#     client_class = OAuth2Client

#     permission_classes = [AllowAny]
#     authentication_classes = []



import os
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny # Pastikan IsAuthenticated di-import
from .permissions import IsGroupMember

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

@method_decorator(csrf_exempt, name='dispatch')
class ThemeUpdateView(APIView):
    """
    Endpoint untuk mengubah tema (Warna/Font).
    Hanya bisa diakses jika:
    1. User sudah Login via Google (Autentikasi)
    2. Email user terdaftar sebagai Anggota (Otorisasi)
    """
    # KEMBALIKAN SATPAMNYA DI SINI:
    permission_classes = [IsAuthenticated, IsGroupMember]
    # Hapus baris authentication_classes = [] agar Django meminta token dari React

    def post(self, request):
        # Data warna/font yang dikirim dari React
        # Mendukung field 'primary_color'/'font_family' dari frontend baru
        # serta 'color'/'font' untuk kompatibilitas
        new_color = request.data.get('primary_color') or request.data.get('color')
        new_font = request.data.get('font_family') or request.data.get('font')
        
        # Tambahan field lain jika ada
        primary_bg = request.data.get('primary_bg')
        primary_text = request.data.get('primary_text')

        # Memastikan bahwa hanya 'whitelist' email yang bisa sampai ke sini
        return Response({
            "status": "success",
            "message": f"Otorisasi Berhasil! Tema diubah ke {new_color} dengan font {new_font}.",
            "user": request.user.email
        })

# ... (Biarkan kelas GoogleLoginView di bawahnya persis seperti sebelumnya) ...
@method_decorator(csrf_exempt, name='dispatch')
class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173" 
    client_class = OAuth2Client

    permission_classes = [AllowAny]
    authentication_classes = []

    def get_response(self):
        from anggota.models import Member
        response = super().get_response()
        
        user = getattr(self, 'user', None)
        
        if response.status_code == 200:
            # Detect where user data is located
            user_data = response.data.get('user') or response.data
            
            # Find email from multiple possible sources
            email = getattr(user, 'email', None)
            if not email and isinstance(user_data, dict):
                email = user_data.get('email')
            
            print(f"DEBUG: Login Attempt for email: '{email}'")

            if email:
                email = email.lower().strip()
                # Get whitelist from .env
                allowed_emails_str = os.getenv("ALLOWED_MEMBER_EMAILS", "")
                allowed_emails = [e.strip().lower() for e in allowed_emails_str.split(",") if e.strip()]
                
                is_member = (email in allowed_emails) or Member.objects.filter(email=email).exists()
                print(f"DEBUG: is_member={is_member} (Whitelist: {email in allowed_emails})")
                
                # Masukkan flag is_member ke semua lokasi yang mungkin dibaca frontend
                if isinstance(response.data, dict):
                    response.data['is_member'] = is_member
                    if 'user' in response.data and isinstance(response.data['user'], dict):
                        response.data['user']['is_member'] = is_member
                    if 'user_info' in response.data and isinstance(response.data['user_info'], dict):
                        response.data['user_info']['is_member'] = is_member
        
        return response