from django.contrib import admin
from .models import Member

# Mendaftarkan tabel Member agar muncul di dashboard Admin
admin.site.register(Member)