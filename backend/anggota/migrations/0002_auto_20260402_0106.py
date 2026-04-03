from django.db import migrations

def buat_data_awal(apps, schema_editor):
    Member = apps.get_model('anggota', 'Member')
    ThemeConfig = apps.get_model('anggota', 'ThemeConfig')

    data_anggota = [
        {
            "name": "Ismail Yanuar Anwas",
            "email": "ismailyanuar1960@gmail.com",
            "student_id": "2306245781",
            "bio": "Backend Developer (Database & Model). Bertanggung jawab atas skema database PostgreSQL dan inisialisasi model."
        },
        {
            "name": "Ahmad Nizar Sauki",
            "email": "mrnoon26@gmail.com",
            "student_id": "2306152046",
            "bio": "Frontend Engineer. Bertanggung jawab atas pengembangan antarmuka pengguna menggunakan React, memastikan desain responsif dan interaktif."
        },
        {
            "name": "Affandi Shafwan Soleh",
            "email": "affandishafwan@gmail.com",
            "student_id": "2306245075",
            "bio": "Integration & QA Programmer. Bertanggung jawab atas integrasi antara frontend dan backend, serta melakukan pengujian untuk memastikan aplikasi berjalan dengan baik."
        },
        {
            "name": "Anita Khoirun Nisa",
            "email": "antkhrnns9@gmail.com",
            "student_id": "2306152273",
            "bio": "UI Developer"
        },
        {
            "name": "Andi Aqsa Mappatunru Marzuki",
            "email": "andiaqsa365@gmail.com",
            "student_id": "2306275046",
            "bio": "Security Engineer. Bertanggung jawab atas keamanan aplikasi, termasuk implementasi otentikasi, otorisasi, dan perlindungan data."
        },
    ]

    for data in data_anggota:
        Member.objects.create(**data)

    ThemeConfig.objects.create(
        primary_color="#f8f9fa",
        font_family="Inter, sans-serif"
    )

class Migration(migrations.Migration):

    dependencies = [
        ('anggota', '0001_initial'), 
    ]

    operations = [
        migrations.RunPython(buat_data_awal),
    ]