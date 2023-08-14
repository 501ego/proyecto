from django.contrib.auth.forms import PasswordChangeForm
from django import forms
from .models import Product, Person, Genre, Region, City, Commune, Profile, Document, IVA
from django.core.validators import EmailValidator
from django.contrib.auth.models import User


class Form_product(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
        widgets = {
            'expiration_date': forms.DateInput(format='%Y-%m-%d', attrs={'type': 'date'}),
            'add_date': forms.DateInput(format='%Y-%m-%d', attrs={'type': 'date'}),
            'is_hidden': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class Form_client(forms.ModelForm):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
        validators=[EmailValidator()],
        required=False
    )
    birth_date = forms.DateField(
        widget=forms.DateInput(
            format='%Y-%m-%d', attrs={'type': 'date', 'class': 'form-control'}),
        required=False
    )

    def clean_email(self):
        email = self.cleaned_data['email']
        if email == '':
            return None
        return email

    class Meta:
        model = Person
        fields = ('rut', 'name', 'last_name', 'id_genre', 'birth_date', 'phone', 'email',
                  'street', 'id_region', 'id_city', 'id_commune', 'company_name', 'giro', 'is_active')
        widgets = {
            'rut': forms.TextInput(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'id_genre': forms.Select(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'street': forms.TextInput(attrs={'class': 'form-control'}),
            'id_region': forms.Select(attrs={'class': 'form-control'}),
            'id_city': forms.Select(attrs={'class': 'form-control'}),
            'id_commune': forms.Select(attrs={'class': 'form-control'}),
            'company_name': forms.TextInput(attrs={'class': 'form-control'}),
            'giro': forms.TextInput(attrs={'class': 'form-control'}),
            'birth_date': forms.DateInput(format='%Y-%m-%d', attrs={'type': 'date'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),

        }

    class Form_employe(forms.ModelForm):
        email = forms.EmailField(
            widget=forms.EmailInput(attrs={'class': 'form-control'}),
            validators=[EmailValidator()],
            required=False
        )

    def clean_email(self):
        email = self.cleaned_data['email']
        if email == '':
            return None
        return email


class Form_genre(forms.ModelForm):
    class Meta:
        model = Genre
        fields = ('description',)
        widgets = {
            'description': forms.TextInput(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['description'].label = 'Nombre de Género'


class Form_region(forms.ModelForm):
    class Meta:
        model = Region
        fields = ('name',)
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].label = 'Nombre de Región'


class Form_ciudad(forms.ModelForm):
    class Meta:
        model = City
        fields = '__all__'
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'id_region': forms.Select(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].label = 'Nombre de Ciudad'


class Form_comuna(forms.ModelForm):
    class Meta:
        model = Commune
        fields = '__all__'
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'id_city': forms.Select(attrs={'class': 'form-control'}),
            'birth_date': forms.DateInput(format='%Y-%m-%d', attrs={'type': 'date'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].label = 'Nombre de Comuna'


class Form_employee(forms.ModelForm):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control'}),
        validators=[EmailValidator()],
        required=True
    )
    birth_date = forms.DateField(
        widget=forms.DateInput(
            format='%Y-%m-%d', attrs={'type': 'date', 'class': 'form-control'}),
        required=True
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        required=True
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        required=True
    )

    def clean_email(self):
        email = self.cleaned_data['email']
        if email == '':
            return None
        return email

    class Meta:
        model = Person
        fields = ('rut', 'name', 'last_name', 'id_genre', 'birth_date', 'phone', 'email',
                  'street', 'id_region', 'id_city', 'id_commune', 'company_name', 'giro',
                  'is_active', 'is_employee', 'id_profile', 'password1', 'password2')
        widgets = {
            'rut': forms.TextInput(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'id_genre': forms.Select(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'street': forms.TextInput(attrs={'class': 'form-control'}),
            'id_region': forms.Select(attrs={'class': 'form-control'}),
            'id_city': forms.Select(attrs={'class': 'form-control'}),
            'id_commune': forms.Select(attrs={'class': 'form-control'}),
            'company_name': forms.TextInput(attrs={'class': 'form-control'}),
            'giro': forms.TextInput(attrs={'class': 'form-control'}),
            'birth_date': forms.DateInput(format='%Y-%m-%d', attrs={'type': 'date'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'is_employee': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'id_profile': forms.Select(attrs={'class': 'form-control'}),
            'password1': forms.PasswordInput(attrs={'class': 'form-control'}),
            'password2': forms.PasswordInput(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].label = 'Contraseña'
        self.fields['password2'].label = 'Confirmar Contraseña'

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Las contraseñas no coinciden")
        return password2

    def save(self, commit=True):
        person = super().save(commit=False)

        password = self.cleaned_data['password1']
        username = self.cleaned_data['email']
        user, created = User.objects.get_or_create(username=username)

        if created:
            user.set_password(password)
            user.is_staff = True
        else:
            if password != user.password:
                user.set_password(password)
            elif username != user.username:
                user.username = username

        person.user = user
        if commit:
            user.save()
            person.save()

        return person


class Form_profile(forms.ModelForm):
    class Meta:
        model = Profile
        fields = '__all__'
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].label = 'Nombre de Perfil'


class Form_iva(forms.ModelForm):
    class Meta:
        model = IVA
        fields = ('value', 'is_active')
        widgets = {
            'value': forms.NumberInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['value'].label = 'Porcentaje de Iva'
        self.fields['is_active'].label = 'Activo'


class CustomPasswordChangeForm(PasswordChangeForm):
    old_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        label="Contraseña anterior",
        required=True
    )
    new_password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        label="Nueva contraseña",
        required=True
    )
    new_password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        label="Confirmar contraseña",
        required=True
    )
