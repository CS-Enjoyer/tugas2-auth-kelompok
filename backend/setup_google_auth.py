import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
from django.conf import settings

def setup_allauth():
    print("Mulai sinkronisasi Google Auth ke database...")
    
    # 1. Update Site object
    site, created = Site.objects.get_or_create(id=settings.SITE_ID)
    site.domain = 'localhost:5173' # Ganti dengan domain production nanti
    site.name = 'Frontend React'
    site.save()
    print(f"Site konvigurasi {'dibuat' if created else 'diperbarui'}: {site.domain}")

    # 2. Setup SocialApp untuk Google
    # Mengambil nilai dari settings/env yang sudah ada
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    secret = os.getenv('GOOGLE_CLIENT_SECRET')

    if not client_id or not secret:
        print("ERROR: GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET tidak ditemukan di env!")
        return

    app, created = SocialApp.objects.get_or_create(
        provider='google',
        name='Google Login React',
        client_id=client_id,
        secret=secret
    )
    
    # Hubungkan App dengan Site
    app.sites.add(site)
    print(f"SocialApp {'dibuat' if created else 'diperbarui'}. Terhubung ke Site ID: {site.id}")
    print("Selesai! Sekarang silakan hapus bagian 'APP' dari SOCIALACCOUNT_PROVIDERS di settings.py")

if __name__ == "__main__":
    setup_allauth()
