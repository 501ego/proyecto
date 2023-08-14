from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from .models import Product, SaleDetail, Sale, Document, Person, IVA, EmployeeRegister, Genre, Profile, Commune, City, Region, OpeningClosing, EmployeeRegister
from .forms import Form_product, Form_client, Form_genre, Form_region, Form_ciudad, Form_comuna, Form_employee, Form_profile, Form_iva, CustomPasswordChangeForm
from .cart import Cart
from .util import total_cart
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template.loader import render_to_string, get_template
from django.views.decorators.http import require_GET
from django.urls import reverse
from xhtml2pdf import pisa
from django.http import HttpResponseForbidden
from django.contrib.auth import update_session_auth_hash
from django.db.models import Sum, F


def profile_required(*required_profile_ids):
    def decorator(view_func):
        @login_required
        def _wrapped_view(request, *args, **kwargs):
            if request.user.person.id_profile.id in required_profile_ids:
                return view_func(request, *args, **kwargs)
            else:
                return HttpResponseForbidden()
        return _wrapped_view
    return decorator


def auth(request):
    return render(request, 'auth.html')


@login_required

def return_page(request):
    employee = request.user.person
    person = Person.objects.all().filter(rut=employee.rut).first()
    if person.id_profile.name == 'Vendedor':
        return redirect('sisventas:form_client')
    elif person.id_profile.name == 'Jefe de Ventas':
        return redirect('sisventas:form_employee')
    elif person.id_profile.name == 'Dueño':
        return redirect('sisventas:form_employee')


@login_required
@profile_required(1, 2, 3)
def authorization(request):
    if request.method == 'POST':
        authuser = request.POST.get('authuser')
        password = request.POST.get('password')
        person = Person.objects.all().filter(rut=authuser).first()
        message = {}
        if person is not None:
            user = authenticate(username=person.email, password=password)
            if user is not None and person.id_profile.id in [2, 3]:
                request.session['is_authorized'] = True
                message = {'authorized': 'true'}
            else:
                request.session['is_authorized'] = False
                message = {'authorized': 'false'}
        else:
            request.session['is_authorized'] = False
            message = {'error': 'Usuario no existe'}
            return JsonResponse(message)
    return JsonResponse(message)


def loginpage(request):
    context = {}
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        person = Person.objects.all().filter(email=username).first()

        if person is None:
            context = {'error': 'Nombre de usuario incorrecto'}
            return render(request, 'login.html', context)
        else:
            if user is not None and user.is_authenticated:
                opening_time = timezone.now().time()
                closing_time = None
                date = timezone.now().date()
                register = EmployeeRegister(
                    opening_time_sesion=opening_time, closing_time_sesion=closing_time, date=date, rut_employee=person)
                register.save()
                login(request, user)
                request.session['register_id'] = register.id
                if person.id_profile.name == 'Vendedor':
                    return redirect('sisventas:pos_system')
                elif person.id_profile.name == 'Jefe de Ventas':
                    return redirect('sisventas:jefe_ventas')
                elif person.id_profile.name == 'Dueño':
                    return redirect('sisventas:jefe_ventas')
            else:
                context = {'error': 'Contraseña incorrecta'}
                return render(request, 'login.html', context)
    return render(request, 'login.html', context)


def logout_view(request):
    register_id = request.session.get('register_id')
    if register_id is not None:
        register = get_object_or_404(EmployeeRegister, id=register_id)
        register.closing_time_sesion = timezone.now().time()
        register.save()
    logout(request)
    return redirect('sisventas:login')


@login_required
@profile_required(1, 2, 3)
def base(request):
    return render(request, 'base.html',)


@login_required
@profile_required(2, 3)
def jefe_ventas(request):
    total = 0
    if request.method == 'POST':
        today_sales = 'today' in request.POST
        week_sales = 'week' in request.POST
        month_sales = 'month' in request.POST
    else:
        today_sales = request.session.get('today', False)
        week_sales = request.session.get('week', False)
        month_sales = request.session.get('month', False)

    request.session['today'] = today_sales
    request.session['week'] = week_sales
    request.session['month'] = month_sales

    sales_list = Sale.objects.all().order_by('-id')
    now = timezone.now()
    if today_sales:
        sales_list = sales_list.filter(
            date__year=now.year, date__month=now.month, date__day=now.day)
        for sale in sales_list:
            total += sale.total
    elif week_sales:
        start_week = now - timezone.timedelta(days=now.weekday())
        end_week = start_week + timezone.timedelta(days=7)
        sales_list = sales_list.filter(date__range=[start_week, end_week])
        for sale in sales_list:
            total += sale.total

    else:
        sales_list = sales_list.filter(
            date__year=now.year, date__month=now.month)
        for sale in sales_list:
            total += sale.total

    paginator = Paginator(sales_list, 12)
    page_number = request.GET.get('page')
    sales = paginator.get_page(page_number)
    context = {
        'sales': sales,
        'total': total,
    }
    return render(request, 'jefe_ventas.html', context)


@login_required
@profile_required(2, 3)
def search_jefe_ventas(request):
    search_term = request.GET.get('search')
    if request.method == 'POST':
        today_sales = 'today' in request.POST
        week_sales = 'week' in request.POST
        month_sales = 'month' in request.POST
    else:
        today_sales = request.session.get('today', False)
        week_sales = request.session.get('week', False)
        month_sales = request.session.get('month', False)

    request.session['today'] = today_sales
    request.session['week'] = week_sales
    request.session['month'] = month_sales

    sales_list = Sale.objects.all()
    now = timezone.now()
    if today_sales:
        sales_list = sales_list.filter(
            date__year=now.year, date__month=now.month, date__day=now.day)
        if search_term.isdigit():
            sales_list = sales_list.filter(
                id__icontains=search_term).order_by('date')
        else:
            sales_list = sales_list.filter(
                seller__name__icontains=search_term).order_by('date')

    elif week_sales:
        start_week = now - timezone.timedelta(days=now.weekday())
        end_week = start_week + timezone.timedelta(days=7)
        sales_list = sales_list.filter(date__range=[start_week, end_week])
        if search_term.isdigit():
            sales_list = sales_list.filter(
                id__icontains=search_term).order_by('date')
        else:
            sales_list = sales_list.filter(
                seller__name__icontains=search_term).order_by('date')

    else:
        sales_list = sales_list.filter(
            date__year=now.year, date__month=now.month)
        if search_term.isdigit():
            sales_list = sales_list.filter(
                id__icontains=search_term).order_by('date')
        else:
            sales_list = sales_list.filter(
                seller__name__icontains=search_term).order_by('date')

    paginator = Paginator(sales_list, 12)
    page_number = request.GET.get('page')
    sales = paginator.get_page(page_number)
    context = {
        'sales': sales,
    }
    return render(request, 'sales_list.html', context)


@login_required
@profile_required(2, 3)
def start_day(request):
    employee = request.user.person
    is_open = OpeningClosing.objects.filter(
        date=timezone.now().date(), is_open=True).exists()
    if not is_open:
        OpeningClosing.objects.create(
            opening_time=timezone.now(),
            date=timezone.now().date(),
            opening_employee=employee,
            is_open=True
        )

    return redirect('sisventas:jefe_ventas')


@login_required
@profile_required(2, 3)
def end_day(request):
    employee = request.user.person
    day = OpeningClosing.objects.get(
        date=timezone.now().date(), is_open=True)
    if day.is_open:
        day.closing_time = timezone.now()
        day.closing_employee = employee
        day.is_open = False
        day.save()

    return redirect('sisventas:jefe_ventas')


@login_required
@profile_required(1)
def pos(request):
    products_list = Product.objects.filter(is_hidden=False).order_by('id')
    paginator = Paginator(products_list, 10)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    get_documents = Document.objects.all().order_by('id')
    documents = []
    for document in get_documents:
        if document.id != 3:
            document = document
            documents.append(document)
    employee = request.user.person
    clients = Person.objects.filter(
        is_employee=False, is_active=True).order_by('rut')
    sales = Sale.objects.filter(
        seller=employee, date=timezone.now().date()).order_by('id')

    total_sales_today = 0
    for sale in sales:
        if sale.document != 'Reembolso':
            total_sales_today += 1

    download_url = request.session.get('download_url', None)
    request.session['download_url'] = None
    context = {
        'products': products,
        'documents': documents,
        'clients': clients,
        'download_url': download_url,
        'total_sales_today': total_sales_today,
    }
    return render(request, 'pos.html', context)


@login_required
@profile_required(1)
@require_GET
def search_products(request):
    search_term = request.GET.get('search')
    if search_term.isdigit():
        products_list = Product.objects.filter(
            id__icontains=search_term, is_hidden=False).order_by('id')
    else:
        products_list = Product.objects.filter(
            name__icontains=search_term, is_hidden=False).order_by('id')
    paginator = Paginator(products_list, 10)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    context = {
        'products': products,
    }
    html = render_to_string('products_page.html', context)
    return HttpResponse(html)


@login_required
@profile_required(2, 3)
@require_GET
def search_inventory(request):
    search_term = request.GET.get('search')
    if search_term.isdigit():
        products_list = Product.objects.filter(
            id__icontains=search_term, is_hidden=False).order_by('id')
    else:
        products_list = Product.objects.filter(
            name__icontains=search_term, is_hidden=False).order_by('id')
    paginator = Paginator(products_list, 11)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    context = {
        'products': products,
    }
    html = render_to_string('inventory_prod_page.html', context)
    return HttpResponse(html)


@login_required
@profile_required(2, 3)
def form_product_delete(request, id):
    product = get_object_or_404(Product, id=id)
    try:
        if SaleDetail.objects.filter(Q(id_product=product.id)).exists():
            product.is_hidden = True
        else:
            product.delete()
        product.save()
    except Exception as e:
        print(e)
    return redirect('sisventas:form_prod')


@login_required
@profile_required(2, 3)
def form_product(request):
    form = Form_product(request.POST or None, request.FILES or None)
    if form.is_valid():
        form.save()
        return redirect('sisventas:form_prod')
    products_list = Product.objects.filter().order_by('id')
    paginator = Paginator(products_list, 11)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    return render(request, 'inventory.html', {'form': form, 'products': products, 'edit_mode': False})


@login_required
@profile_required(2, 3)
def form_product_edit(request, id):
    product = Product.objects.get(id=id)
    form = Form_product(
        request.POST or None, request.FILES or None, instance=product)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
    else:
        print(form.errors)
    products_list = Product.objects.filter().order_by('id')
    paginator = Paginator(products_list, 12)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    context = {
        'form': form,
        'products': products,
        'edit_mode': True,
    }
    return render(request, 'inventory.html', context)


@login_required
@profile_required(1)
def add_product_cart(request, id):
    cart = Cart(request)
    product = Product.objects.get(id=id)
    cart.add(product=product)
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required
@profile_required(1)
def remove_product_cart(request, id):
    cart = Cart(request)
    product = Product.objects.get(id=id)
    cart.remove(product=product)
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required
@profile_required(1)
def clear_cart(request):
    cart = Cart(request)
    cart.clear()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required
@profile_required(1)
def update_cart(request, id):
    cart = Cart(request)
    product = Product.objects.get(id=id)
    quantity = int(request.POST.get('quantity'))
    cart.update_quantity(product=product, quantity=quantity)
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required
@profile_required(1)
def confirm_sale(request):
    if request.method == 'POST':
        document_name = request.POST.get('document_name')
        cart = Cart(request)
        seller = request.user.person
        client_rut = request.POST.get('client_rut')
        client = Person.objects.filter(rut=client_rut).first()
        document = Document.objects.get(name=document_name)
        total = total_cart(request.session["cart"])
        print('document_name:', document_name)
        if document_name == 'Factura':
            sale = Sale(
                document=document,
                date=timezone.now(),
                hour=timezone.now(),
                total=total,
                iva_value=IVA.objects.first(),
                seller=seller,
                client=client,
            )
            sale.save()
        else:
            sale = Sale(
                document=document,
                date=timezone.now(),
                hour=timezone.now(),
                total=total,
                iva_value=IVA.objects.first(),
                seller=seller,
                client=client,
            )
            sale.save()

    for item in cart.items:
        product = Product.objects.get(id=item['product_id'])
        sale_detail = SaleDetail(
            id_product=product,
            product_quantity=item['quantity'],
            unit_price=item['price'],
            subtotal=item['subtotal'],
            id_sale=sale
        )
        sale_detail.save()
        product.stock -= item['quantity']
        product.save()

    cart.clear()
    pdf_url = reverse('sisventas:document', args=[sale.id])
    request.session['download_url'] = pdf_url
    return redirect('sisventas:pos_system')


@login_required
@profile_required(1, 2, 3)
def document(request, sale_id):
    sale = Sale.objects.get(id=sale_id)
    date = sale.date
    client = sale.client
    if client is not None:
        giro = client.giro
        company = client.company_name
    else:
        giro = None
        company = None
    document = sale.document
    number = sale.id
    total = sale.total
    subtotal = int(sale.total) - int(int(sale.total)) * \
        (sale.iva_value.value / 100)
    seller = sale.seller
    total_iva = int(total) * (sale.iva_value.value / 100)
    detail = SaleDetail.objects.filter(id_sale=sale)
    context = {
        'fecha': date,
        'cliente': client,
        'documento': document,
        'numero': number,
        'subtotal': subtotal,
        'total': total,
        'vendedor': seller,
        'detalle': detail,
        'total_iva': total_iva,
        'giro': giro,
        'company': company,
    }
    if document.name == 'Boleta':
        template_path = 'boleta.html'
        template = get_template(template_path)
        html = template.render(context)
    elif document.name == 'Reembolso':
        template_path = 'creditnote.html'
        template = get_template(template_path)
        html = template.render(context)
    else:
        template_path = 'factura.html'
        template = get_template(template_path)
        html = template.render(context)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=boleta' + \
        str(sale.id) + '.pdf'

    pisa_status = pisa.CreatePDF(
        html, dest=response)

    if pisa_status.err:
        return HttpResponse('Algo salió mal <pre>' + html + '</pre>')
    return response


@login_required
@profile_required(2)
def delete_sale_id(request):
    if 'sale_id' in request.session:
        del request.session['sale_id']
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required
@profile_required(1)
def refund(request):
    download_url = request.session.get('download_url')
    if request.method == 'POST':
        sale_id = request.POST.get('sale_id')
        if sale_id == '' or sale_id == 0:
            sale_id = None
        request.session['sale_id'] = sale_id
    else:
        sale_id = request.session.get('sale_id', None)

    exist = Sale.objects.filter(id=sale_id).exists()
    if exist is False:
        sale_id = None
    products = SaleDetail.objects.filter(id_sale=sale_id)
    product_data = []
    if sale_id is not None:
        for product in products:
            product_id = product.id_product
            product_quantity = product.product_quantity
            product = Product.objects.get(id=product_id.id)
            product_name = product.name
            product_data.append({
                'product': product_name,
                'id': product_id,
                'quantity': product_quantity,
            })
    request.session['download_url'] = None
    products_list = Product.objects.all()
    paginator = Paginator(products_list, 10)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    context = {
        'download_url': download_url,
        'product_data': product_data,
        'sale_id': sale_id,
        'products': products,

    }
    return render(request, 'refund.html', context)


@login_required
@profile_required(1)
def change_product(request, sale_id=None):
    if request.method == 'POST':
        if sale_id is None:
            sale_id = request.POST.get('sale_id')
        exist = Sale.objects.filter(original_sale_id=sale_id).exists()

        item_ids = request.POST.getlist('item_ids')
        quantity_list = request.POST.getlist('quantity')
        authorized = request.POST.get('authorized')
        if authorized == 'true' and exist is False:
            sale = Sale.objects.get(id=sale_id)
            seller = request.user.person
            cart = Cart(request)
            refund = Sale(
                document=Document.objects.get(name='Reembolso'),
                date=timezone.now(),
                hour=timezone.now(),
                total=0,
                seller=seller,
                client=sale.client,
                iva_value=IVA.objects.first(),
                original_sale_id=sale_id,
                is_refund=True,
            )
            refund.save()
            for item_id, quantity in zip(item_ids, quantity_list):
                quantity = int(quantity) if quantity != '' else 0
                if quantity > 0:
                    product = Product.objects.get(id=item_id)
                    unit_price = product.unit_price * -1
                    subtotal_refund = unit_price * quantity
                    refund_detail = SaleDetail(
                        id_sale=refund,
                        id_product=product,
                        product_quantity=quantity,
                        unit_price=unit_price,
                        subtotal=subtotal_refund,
                        original_sale_id=sale_id,
                    )
                    refund_detail.save()
                    refund.total += subtotal_refund
                    product.stock += quantity
                    product.save()
                    refund.save()
            if cart.items:
                new_sale = Sale(
                    document=sale.document,
                    date=timezone.now(),
                    hour=timezone.now(),
                    total=0,
                    seller=seller,
                    client=sale.client,
                    iva_value=IVA.objects.first(),
                    original_sale_id=sale_id,
                    is_refund=False,
                )
                new_sale.save()
                for item in cart.items:
                    product_cart = Product.objects.get(
                        id=item['product_id'])
                    new_detail = SaleDetail(
                        id_product=product_cart,
                        product_quantity=item['quantity'],
                        unit_price=item['price'],
                        subtotal=item['subtotal'],
                        id_sale=new_sale,
                        original_sale_id=sale_id,
                    )
                    new_detail.save()
                    product.stock -= item['quantity']
                    product.save()
                    new_sale.total += new_detail.subtotal
                new_sale.save()
                clear_cart(request)
                new_sale_pdf_url = reverse(
                    'sisventas:document', args=[new_sale.id])

                request.session['download_url'] = new_sale_pdf_url
                data = {'message': 'success'}
                print('se guardo el reembolso y la nueva venta')
                return JsonResponse(data)
            else:
                pdf_url = reverse('sisventas:document', args=[refund.id])
                request.session['download_url'] = pdf_url
                data = {'message': 'success'}
                print('se guardo el reembolso')
                return JsonResponse(data)
        else:
            data = {'message': 'error'}
            return JsonResponse(data)
    return render(request, 'change_product.html')


@login_required
@profile_required(1)
@require_GET
def search_products_change(request):
    search_term = request.GET.get('search')
    if search_term.isdigit():
        products_list = Product.objects.filter(
            id__icontains=search_term, is_hidden=False).order_by('id')
    else:
        products_list = Product.objects.filter(
            name__icontains=search_term, is_hidden=False).order_by('id')
    paginator = Paginator(products_list, 10)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    context = {
        'products': products,
    }
    html = render_to_string('products_page.html', context)
    return HttpResponse(html)


@login_required
@profile_required(2, 3)
def form_employee(request):
    form = Form_employee(request.POST or None)
    if form.is_valid():
        exist = Person.objects.filter(rut=form.cleaned_data['rut']).exists()
        print(exist)
        print(exist)
        print(exist)
        if exist:
            return JsonResponse({'message': 'rut existente'})
        else:
            form.save()
            return redirect('sisventas:form_employee')
    else:
        print(form.errors)

    employees_list = Person.objects.filter(is_employee=True).order_by('rut')
    paginator = Paginator(employees_list, 12)
    page_number = request.GET.get('page')
    employees = paginator.get_page(page_number)
    context = {
        'form': form,
        'employees': employees,
        'edit_mode': False,
    }
    return render(request, 'form_employee.html', context)


@login_required
@profile_required(2, 3)
def form_employee_edit(request, rut):
    employee = Person.objects.get(rut=rut)
    form = Form_employee(
        request.POST or None, request.FILES or None, instance=employee)
    if form.is_valid():
        form.save()
        return redirect('sisventas:form_employee')
    else:
        print(form.errors)
    employees_list = Person.objects.filter(is_employee=True).order_by('rut')
    paginator = Paginator(employees_list, 12)
    page_number = request.GET.get('page')
    employees = paginator.get_page(page_number)
    context = {
        'form': form,
        'employees': employees,
        'edit_mode': True,
    }
    return render(request, 'form_employee.html', context)


@login_required
@profile_required(2, 3)
def form_employee_delete(request, rut):
    try:
        employee = Person.objects.get(rut=rut)
        if Sale.objects.filter(seller=employee).exists():
            employee.is_active = False
            employee.save()
        else:
            employee.delete()
    except Exception as e:
        print(e)

    return redirect('sisventas:form_employee')


@login_required
@profile_required(1)
def form_client(request):
    form = Form_client(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('sisventas:form_client')
    clients_list = Person.objects.filter(is_employee=False).order_by('rut')
    genres = Genre.objects.all().order_by('id')
    paginator = Paginator(clients_list, 12)
    page_number = request.GET.get('page')
    clients = paginator.get_page(page_number)
    context = {
        'form': form,
        'clients': clients,
        'edit_mode': False,
        'genres': genres,
    }
    return render(request, 'clients.html', context)


@login_required
@profile_required(1)
def form_client_edit(request, rut):
    client = Person.objects.get(rut=rut)
    form = Form_client(
        request.POST or None, request.FILES or None, instance=client)
    if form.is_valid():
        form.save()
        return redirect('sisventas:form_client')
    else:
        print(form.errors)
    clients_list = Person.objects.filter(is_employee=False).order_by('rut')
    paginator = Paginator(clients_list, 12)
    page_number = request.GET.get('page')
    clients = paginator.get_page(page_number)
    context = {
        'form': form,
        'clients': clients,
        'edit_mode': True,
    }
    return render(request, 'clients.html', context)


@login_required
@profile_required(1)
def form_client_delete(request, rut):
    try:
        client = get_object_or_404(Person, rut=rut)
        if Sale.objects.filter(client=client).exists():
            client.is_active = False
            client.save()
        else:
            client.delete()
    except Exception as e:
        print(e)
    return redirect('sisventas:form_client')


@login_required
@profile_required(1)
@require_GET
def search_client(request):
    search_term = request.GET.get('search')
    if search_term.isdigit():
        clients_list = Person.objects.filter(
            rut__icontains=search_term, is_employee=False).order_by('rut')
    else:
        clients_list = Person.objects.filter(
            name__icontains=search_term, is_employee=False).order_by('rut')
    paginator = Paginator(clients_list, 12)
    page_number = request.GET.get('page')
    clients = paginator.get_page(page_number)
    context = {
        'clients': clients,
    }
    html = render_to_string('clients_page.html', context)
    return HttpResponse(html)


@login_required
@profile_required(2, 3)
def sales_jefe_ventas(request):
    sales_list = Sale.objects.all().order_by('-id')
    paginator = Paginator(sales_list, 12)
    page_number = request.GET.get('page')
    sales = paginator.get_page(page_number)
    total = 0
    for sale in sales_list:
        subtotal = sale.total
        total += subtotal

    context = {
        'sales': sales,
        'total': total,
    }
    return render(request, 'sales_jefe_ventas.html', context)


@login_required
@profile_required(1)
def sales_vendedor(request):
    employee = employee = request.user.person
    sales_list = Sale.objects.filter(
        seller=employee, date=timezone.now().date()).order_by('-id')
    paginator = Paginator(sales_list, 12)
    page_number = request.GET.get('page')
    sales = paginator.get_page(page_number)
    total = 0
    for sale in sales_list:
        subtotal = sale.total
        total += subtotal

    context = {
        'sales': sales,
        'total': total,
    }
    return render(request, 'sales_vendedor.html', context)


@login_required
@profile_required(1, 2, 3)
@require_GET
def search_sale(request):
    search_term = request.GET.get('search', '')
    employee = str(request.user.person)
    full_name = employee.split(' ')
    name = full_name[0]
    last_name = full_name[1]
    person = Person.objects.all().filter(name=name, last_name=last_name).first()
    if not search_term:
        if person.id_profile.id == 1:
            sales_list = Sale.objects.filter(
                seller=person.rut).order_by('-id')
        else:
            sales_list = Sale.objects.all().order_by('-id')
    else:
        if person.id_profile.id == 1:
            if search_term.isdigit():
                sales_list = Sale.objects.filter(
                    id__icontains=search_term, seller=person.rut).order_by('-id')
            else:
                sales_list = Sale.objects.filter(
                    seller__name__icontains=search_term, seller=person.rut).order_by('-id')
        else:
            if search_term.isdigit():
                sales_list = Sale.objects.filter(
                    id__icontains=search_term).order_by('-id')
            else:
                sales_list = Sale.objects.filter(
                    seller__name__icontains=search_term).order_by('-id')
    paginator = Paginator(sales_list, 12)
    page_number = request.GET.get('page')
    sales = paginator.get_page(page_number)
    html = render_to_string('sales_list.html', {'sales': sales})
    return HttpResponse(html)


@login_required
@profile_required(1, 2, 3)
def sale_detail(request, sale_id):
    sale = Sale.objects.get(id=sale_id)
    details = SaleDetail.objects.filter(id_sale=sale)
    products = Product.objects.filter().values('name', 'id')
    user = request.user.person
    employee = Person.objects.get(rut=user.rut)
    profile = employee.id_profile.id

    total = 0
    for product in details:
        subtotal = product.subtotal
        total += subtotal

    context = {'sale': sale,
               'details': details,
               'products': products,
               'total': total,
               'profile': profile,

               }
    return render(request, 'sale_detail.html', context)


@login_required
@profile_required(1, 2, 3)
def genre(request):
    if request.method == "POST":
        form = Form_genre(request.POST)
        if form.is_valid():
            form.save()
            return redirect('sisventas:genre')
    form = Form_genre()
    genres = Genre.objects.all().order_by('id')
    context = {
        'genres': genres,
        'form': form,
    }
    return render(request, 'genre.html', context)


@login_required
@profile_required(1, 2, 3)
def genre_delete(request, id):
    genre = get_object_or_404(Genre, id=id)
    try:
        genre.delete()
    except Exception as e:
        print(e)
    return redirect('sisventas:genre')


@login_required
@profile_required(1, 2, 3)
def genre_edit(request, id):
    genre = get_object_or_404(Genre, id=id)
    form = Form_genre(request.POST or None, instance=genre)
    if form.is_valid():
        form.save()
        return redirect('sisventas:genre')
    else:
        print(form.errors)
    genres = Genre.objects.all().order_by('id')
    context = {
        'genres': genres,
        'form': form,
        'edit_mode': True,
    }
    return render(request, 'genre.html', context)


@login_required
@profile_required(2, 3)
def iva(request):
    if request.method == "POST":
        form = Form_iva(request.POST)
        if form.is_valid():
            form.save()
            return redirect('sisventas:iva')
    form = Form_iva()
    ivas = IVA.objects.all().order_by('id')
    context = {
        'ivas': ivas,
        'form': form,
    }
    return render(request, 'iva.html', context)


@login_required
@profile_required(2, 3)
def iva_delete(request, id):
    iva = get_object_or_404(IVA, id=id)
    try:
        iva.delete()
    except Exception as e:
        print(e)
    return redirect('sisventas:iva')


@login_required
@profile_required(2, 3)
def iva_edit(request, id):
    iva = get_object_or_404(IVA, id=id)
    form = Form_iva(request.POST or None, instance=iva)
    if form.is_valid():
        form.save()
        return redirect('sisventas:iva')
    else:
        print(form.errors)
    ivas = IVA.objects.all().order_by('id')
    context = {
        'ivas': ivas,
        'form': form,
        'edit_mode': True,
    }
    return render(request, 'iva.html', context)


@login_required
@profile_required(2, 3)
def profile(request):
    if request.method == "POST":
        form = Form_profile(request.POST)
        if form.is_valid():
            form.save()
            return redirect('sisventas:profile')
    form = Form_profile()
    profiles = Profile.objects.all().order_by('id')
    context = {
        'profiles': profiles,
        'form': form,
    }
    return render(request, 'profile.html', context)


@login_required
@profile_required(2)
def profile_delete(request, id):
    profile = get_object_or_404(Profile, id=id)
    try:
        profile.delete()
    except Exception as e:
        print(e)
    return redirect('sisventas:profile')


@login_required
@profile_required(2, 3)
def profile_edit(request, id):
    profile = get_object_or_404(Profile, id=id)
    form = Form_profile(request.POST or None, instance=profile)
    if form.is_valid():
        form.save()
        return redirect('sisventas:profile')
    else:
        print(form.errors)
    profiles = Profile.objects.all().order_by('id')
    context = {
        'profiles': profiles,
        'form': form,
        'edit_mode': True,
    }
    return render(request, 'profile.html', context)


@login_required
@profile_required(1, 2, 3)
def form_location(request):
    if request.method == "POST":
        form_type = request.POST.get('form_type')
        if form_type == 'region':
            print(form_type)
            form_region = Form_region(request.POST)
            if form_region.is_valid():
                print(form_region)
                form_region.save()
                return redirect('sisventas:form_location')

        elif form_type == 'ciudad':
            print(form_type)
            form_ciudad = Form_ciudad(request.POST)
            if form_ciudad.is_valid():
                print(form_ciudad)
                form_ciudad.save()
                return redirect('sisventas:form_location')
        elif form_type == 'comuna':
            print(form_type)
            form_comuna = Form_comuna(request.POST)
            if form_comuna.is_valid():
                print(form_comuna)
                form_comuna.save()
                return redirect('sisventas:form_location')
    form_comuna = Form_comuna()
    comunas = Commune.objects.all().order_by('id')
    form_ciudad = Form_ciudad()
    ciudades = City.objects.all().order_by('id')
    form_region = Form_region()
    regions = Region.objects.all().order_by('id')

    context = {
        'regions': regions,
        'form_region': form_region,
        'ciudades': ciudades,
        'form_ciudad': form_ciudad,
        'comunas': comunas,
        'form_comuna': form_comuna,
    }
    return render(request, 'form_location.html', context)


@login_required
@profile_required(1, 2, 3)
def region_delete(request, id):
    region = get_object_or_404(Region, id=id)
    try:
        region.delete()
    except Exception as e:
        print(e)
    return redirect('sisventas:form_location')


@login_required
@profile_required(1, 2, 3)
def region_edit(request, id):
    region = get_object_or_404(Region, id=id)
    form_region = Form_region(request.POST or None, instance=region)
    if form_region.is_valid():
        form_region.save()
        return redirect('sisventas:form_location')
    else:
        print(form_region.errors)
    ciudades = City.objects.all().order_by('id')
    comunas = Commune.objects.all().order_by('id')
    regions = Region.objects.all().order_by('id')
    form_comuna = Form_comuna()
    form_ciudad = Form_ciudad()
    context = {
        'regions': regions,
        'form_region': form_region,
        'ciudades': ciudades,
        'comunas': comunas,
        'form_comuna': form_comuna,
        'form_ciudad': form_ciudad,
        'edit_mode': True,
    }
    return render(request, 'form_location.html', context)


@login_required
@profile_required(1, 2, 3)
def ciudad_delete(request, id):
    ciudad = get_object_or_404(City, id=id)
    try:
        ciudad.delete()
    except Exception as e:
        print(e)
    return redirect('sisventas:form_location')


@login_required
@profile_required(1, 2, 3)
def ciudad_edit(request, id):
    ciudad = get_object_or_404(City, id=id)
    form_ciudad = Form_ciudad(request.POST or None, instance=ciudad)
    if form_ciudad.is_valid():
        form_ciudad.save()
        return redirect('sisventas:form_location')
    else:
        print(form_ciudad.errors)
    ciudades = City.objects.all().order_by('id')
    comunas = Commune.objects.all().order_by('id')
    regions = Region.objects.all().order_by('id')
    form_comuna = Form_comuna()
    form_region = Form_region()
    context = {
        'ciudades': ciudades,
        'form_ciudad': form_ciudad,
        'comunas': comunas,
        'regions': regions,
        'form_comuna': form_comuna,
        'form_region': form_region,
        'edit_mode': True,
    }
    return render(request, 'form_location.html', context)


@login_required
@profile_required(1, 2, 3)
def comuna_edit(request, id):
    comuna = get_object_or_404(Commune, id=id)
    form_comuna = Form_comuna(request.POST or None, instance=comuna)
    if form_comuna.is_valid():
        form_comuna.save()
        return redirect('sisventas:form_location')
    ciudades = City.objects.all().order_by('id')
    comunas = Commune.objects.all().order_by('id')
    regions = Region.objects.all().order_by('id')
    form_ciudad = Form_ciudad()
    form_region = Form_region()
    context = {
        'comunas': comunas,
        'form_comuna': form_comuna,
        'ciudades': ciudades,
        'regions': regions,
        'form_ciudad': form_ciudad,
        'form_region': form_region,
        'edit_mode': True,
    }
    return render(request, 'form_location.html', context)


@login_required
@profile_required(1, 2, 3)
def comuna_delete(request, id):
    comuna = get_object_or_404(Commune, id=id)
    try:
        comuna.delete()
    except Exception as e:
        print(e)
    return redirect('sisventas:form_location')


@login_required
@profile_required(2, 3)
def working_hours(request):
    if request.method == 'POST':
        today_registers = 'today' in request.POST
        week_registers = 'week' in request.POST
        month_registers = 'month' in request.POST

    else:
        today_registers = request.session.get('today', False)
        week_registers = request.session.get('week', False)
        month_registers = request.session.get('month', False)

    request.session['today'] = today_registers
    request.session['week'] = week_registers
    request.session['month'] = month_registers
    registers_list = EmployeeRegister.objects.all().order_by('date')
    now = timezone.now()
    if today_registers:
        registers_list = registers_list.filter(
            date__year=now.year, date__month=now.month, date__day=now.day)
    elif week_registers:
        start_week = now - timezone.timedelta(days=now.weekday())
        end_week = start_week + timezone.timedelta(days=7)
        registers_list = registers_list.filter(
            date__range=[start_week, end_week])
    else:
        registers_list = registers_list.filter(
            date__year=now.year, date__month=now.month)
    paginator = Paginator(registers_list, 12)
    page_number = request.GET.get('page')
    registers = paginator.get_page(page_number)
    context = {
        'registers': registers,
        'today_registers': today_registers,
        'week_registers': week_registers,
        'month_registers': month_registers,
    }
    return render(request, 'employee_register.html', context)


@login_required
@profile_required(1, 2, 3)
def change_credentials(request):
    if request.user.is_authenticated:
        user = request.user.person
        username = Person.objects.get(rut=user.rut)
        if request.method == 'POST':
            form = CustomPasswordChangeForm(request.user, request.POST)
            if form.is_valid():
                user = form.save()
                update_session_auth_hash(request, user)
                print('success')
                return JsonResponse({
                    'message': 'success',
                    'redirect_url': request.build_absolute_uri(reverse('sisventas:login'))
                })
            else:
                form = CustomPasswordChangeForm(request.user)
                print(form.errors)
                print(form.non_field_errors)
                return JsonResponse({'message': 'error'})
        else:
            form = CustomPasswordChangeForm(request.user)
        context = {
            'form': form,
            'user': user,
            'username': username,
        }
        return render(request, 'personal_credentials.html', context)
    else:
        return redirect('sisventas:login')


@login_required
@profile_required(2, 3)
def sales_report(request):
    if request.method == 'POST':
        today_sales = 'today' in request.POST
        week_sales = 'week' in request.POST
        month_sales = 'month' in request.POST
        year_sales = 'year' in request.POST
    else:
        today_sales = request.session.get('today', False)
        week_sales = request.session.get('week', False)
        month_sales = request.session.get('month', False)
        year_sales = request.session.get('year', False)

    request.session['today'] = today_sales
    request.session['week'] = week_sales
    request.session['month'] = month_sales
    request.session['year'] = year_sales

    sellers = Person.objects.filter(id_profile=1)
    seller_sales = []

    for seller in sellers:
        sales = Sale.objects.filter(seller=seller)
        total_sales = sales.aggregate(total_sales=Sum('total'))['total_sales']
        if total_sales is None:
            total_sales = 0
        num_sales = sales.count()
        seller_sales.append({
            'seller': seller,
            'rut': seller.rut,
            'total_sales': total_sales,
            'num_sales': num_sales,
        })
    seller_sales.sort(key=lambda x: x['total_sales'], reverse=True)

    sellers = Person.objects.filter(id_profile=1)
    most_profitable_seller = None
    most_profitable_amount = 0

    for seller in sellers:
        total_sales = Sale.objects.filter(seller=seller).aggregate(
            total_sales=Sum('total'))['total_sales']
        if total_sales is None:
            total_sales = 0
        if total_sales > most_profitable_amount:
            most_profitable_seller = seller
            most_profitable_amount = total_sales

    products = Product.objects.all()
    best_selling_product = None
    best_selling_product_amount = 0
    best_selling_product_quantity = 0
    for product in products:
        total_sales = SaleDetail.objects.filter(id_product=product).aggregate(
            total_sales=Sum('subtotal'))['total_sales']
        total_quantity = SaleDetail.objects.filter(id_product=product).aggregate(
            total_quantity=Sum('product_quantity'))['total_quantity']

        if total_sales is None:
            total_sales = 0
        if total_quantity is None:
            total_quantity = 0
        if total_sales > best_selling_product_amount:
            best_selling_product = product
            best_selling_product_amount = total_sales
            best_selling_product_quantity = total_quantity

    sales_list = Sale.objects.all()

    now = timezone.now()
    sales_list_today = sales_list.filter(
        date__year=now.year, date__month=now.month, date__day=now.day)

    total_amount_today = 0
    for sale in sales_list_today:
        total_amount_today += sale.total
    sales_today = sales_list_today.count()

    start_week = now - timezone.timedelta(days=now.weekday())
    end_week = start_week + timezone.timedelta(days=7)
    sales_list_week = sales_list.filter(
        date__range=[start_week, end_week])

    total_amount_week = 0
    for sale in sales_list_week:
        total_amount_week += sale.total
    sales_week = sales_list_week.count()

    sales_list_month = sales_list.filter(
        date__year=now.year, date__month=now.month)

    total_amount_month = 0
    for sale in sales_list_month:
        total_amount_month += sale.total
    sales_month = sales_list_month.count()

    sales_list_year = sales_list.filter(
        date__year=now.year)

    total_amount_year = 0
    for sale in sales_list_year:
        total_amount_year += sale.total
    sales_year = sales_list_year.count()

    paginator = Paginator(seller_sales, 12)
    page_number = request.GET.get('page')
    sales = paginator.get_page(page_number)

    product_sales = SaleDetail.objects.values('id_product_id', 'id_product__name').annotate(
        total_sales=Sum('subtotal'),
        total_quantity=Sum('product_quantity')
    )

    top_10_products = product_sales.order_by('-total_sales')[:10]

    for product_sale in top_10_products:

        total_sales = product_sale['total_sales']
        total_quantity = product_sale['total_quantity']

    context = {
        'sales': sales,
        'total_amount_today': total_amount_today,
        'total_amount_week': total_amount_week,
        'total_amount_month': total_amount_month,
        'total_amount_year': total_amount_year,
        'most_profitable_seller': most_profitable_seller,
        'most_profitable_amount': most_profitable_amount,
        'best_selling_product': best_selling_product,
        'best_selling_product_amount': best_selling_product_amount,
        'best_selling_product_quantity': best_selling_product_quantity,
        'sales_today': sales_today,
        'sales_week': sales_week,
        'sales_month': sales_month,
        'sales_year': sales_year,
        'top_10_products': top_10_products,
    }
    return render(request, 'sales_report.html', context)


@login_required
@profile_required(2, 3)
def open_close_list(request):
    registers = OpeningClosing.objects.all().order_by('date')
    paginator = Paginator(registers, 12)
    page_number = request.GET.get('page')
    registers = paginator.get_page(page_number)

    context = {
        'registers': registers,

    }
    return render(request, 'open_close.html', context)
