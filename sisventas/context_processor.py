from .util import total_cart


def cart_total(request):
    cart_total = 0
    if request.user.is_authenticated:
        cart = request.session.get('cart', {})
        cart_total = total_cart(cart)
    return {'cart_total': cart_total}
