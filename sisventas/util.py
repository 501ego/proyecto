def total_cart(cart):
    total = 0
    for value in cart.values():
        subtotal = value.get("subtotal")
        if subtotal is not None:
            total += int(subtotal)
    return total
