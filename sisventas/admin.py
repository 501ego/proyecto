from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import Person, Product, Genre, Profile, Region, City, Commune, Document, IVA, Sale, SaleDetail, OpeningClosing, EmployeeRegister

admin.site.register(Product)
admin.site.register(Genre)
admin.site.register(Profile)
admin.site.register(Region)
admin.site.register(City)
admin.site.register(Commune)
admin.site.register(Document)
admin.site.register(IVA)
admin.site.register(Sale)
admin.site.register(SaleDetail)
admin.site.register(OpeningClosing)
admin.site.register(EmployeeRegister)


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'password1', 'password2')


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm


class PersonCreationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    verify_password = forms.CharField(widget=forms.PasswordInput)
    email = forms.EmailField()

    class Meta:
        model = Person
        fields = '__all__'
        exclude = ['user']

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        verify_password = cleaned_data.get('verify_password')
        if password and verify_password and password != verify_password:
            self.add_error('password', "Las contraseñas no coinciden")
            self.add_error('verify_password', "Las contraseñas no coinciden")
        return cleaned_data

    def save(self, commit=True):
        person = super().save(commit=False)
        password = self.cleaned_data.get('password')
        username = self.cleaned_data.get('email')
        if person.id_profile and person.id_profile.id in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] and not person.user:
            user = User.objects.create_user(
                username=username, password=password, is_staff=True)
            person.user = user
        elif person.user:
            person.user.username = username
            person.user.password = password
            person.user.is_staff = True
            person.user.save()

        if commit:
            person.save()
        return person


class PersonAdmin(admin.ModelAdmin):
    form = PersonCreationForm
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('rut', 'password', 'name', 'last_name', 'id_genre', 'phone', 'email', 'street', 'id_region', 'id_city', 'id_commune', 'company_name', 'giro', 'id_profile'),
        }),
    )
    list_display = ('rut', 'name', 'last_name', 'email')
    list_filter = ('id_genre', 'id_region')
    search_fields = ('rut', 'name', 'last_name', 'email')


admin.site.register(Person, PersonAdmin)
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
