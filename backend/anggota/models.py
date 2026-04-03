from django.db import models

class Member(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)  
    student_id = models.CharField(max_length=20)
    bio = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.student_id})"

class ThemeConfig(models.Model):
    primary_color = models.CharField(max_length=20, default="#ffffff")
    font_family = models.CharField(max_length=100, default="Inter, sans-serif")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Konfigurasi Tema - Terakhir diubah: {self.updated_at}"