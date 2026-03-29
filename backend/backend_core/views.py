from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsGroupMember

class ThemeUpdateView(APIView):
    """
    Endpoint untuk mengubah tema (Warna/Font).
    Hanya bisa diakses jika:
    1. User sudah Login via Google (Autentikasi)
    2. Email user terdaftar sebagai Anggota (Otorisasi)
    """
    permission_classes = [IsAuthenticated, IsGroupMember]

    def post(self, request):
        # Data warna/font yang dikirim dari React
        new_color = request.data.get('color')
        new_font = request.data.get('font')

        # memastikan bahwa hanya 'whitelist' email yang bisa sampai ke sini
        return Response({
            "status": "success",
            "message": f"Otorisasi Berhasil! Tema diubah ke {new_color} dengan font {new_font}.",
            "user": request.user.email
        })