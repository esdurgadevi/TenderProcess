from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'role',
            'company_name',
            'phone'
        ]

    def create(self, validated_data):

        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role'],
            company_name=validated_data.get('company_name'),
            phone=validated_data.get('phone')
        )

        user.set_password(validated_data['password'])
        user.save()

        return user