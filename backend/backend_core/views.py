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
        new_color = request.data.get('color')
        new_font = request.data.get('font')

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
        """
        Menambahkan flag is_member ke dalam data user yang dikembalikan ke frontend.
        is_member = true jika email user terdaftar di tabel Member.
        """
        from anggota.models import Member
        response = super().get_response()
        
        # User details serializer biasanya mengembalikan data user di field 'user'
        if response.status_code == 200 and 'user' in response.data:
            user_data = response.data['user']
            email = user_data.get('email')
            if email:
                user_data['is_member'] = Member.objects.filter(email=email).exists()
            else:
                user_data['is_member'] = False
        
        return response