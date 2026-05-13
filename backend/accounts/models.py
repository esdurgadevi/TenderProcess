from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    ROLE_CHOICES = (
        ('TENDER_PROVIDER', 'Tender Provider'),
        ('BIDDER', 'Bidder'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    company_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username