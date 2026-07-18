from rest_framework import serializers

from .models import AdminUser


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    created_by_email = serializers.EmailField(source="created_by.email", read_only=True)
    updated_by_email = serializers.EmailField(source="updated_by.email", read_only=True)

    class Meta:
        model = AdminUser
        fields = [
            "id",
            "email",
            "full_name",
            "is_active",
            "password",
            "created_by_email",
            "created_date",
            "updated_by_email",
            "updated_date",
        ]
        read_only_fields = ["created_date", "updated_date"]

    def validate(self, attrs):
        if self.instance is None and not attrs.get("password"):
            raise serializers.ValidationError({"password": "Password is required for a new admin."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = AdminUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password = serializers.CharField(min_length=6)
