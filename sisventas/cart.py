from collections import defaultdict


class Cart:
    """
    Clase que representa el carro de compras.

    Attributes:
        request (HttpRequest): La solicitud HTTP del cliente.
        session (Session): La sesión del cliente.
        cart (defaultdict): Diccionario que almacena los elementos del carro de compras.

    Methods:
        add: Agrega un producto al carro de compras.
        save_cart: Guarda los cambios realizados en el carro de compras.
        remove: Elimina un producto del carro de compras.
        subtract: Resta la cantidad de un producto del carro de compras.
        clear: Limpia el carro de compras.
        update_quantity: Actualiza la cantidad de un producto en el carro de compras.
    """

    def __init__(self, request):
        """
        Inicializa una instancia del carro de compras.

        Args:
            request (HttpRequest): La solicitud HTTP del cliente.
        """
        self.request = request
        self.session = request.session
        cart = self.session.get("cart")
        if not cart:
            cart = self.session["cart"] = {}
        self.cart = defaultdict(dict, cart)

    def add(self, product):
        """
        Agrega un producto al carro de compras.

        Args:
            product (Product): El producto a agregar.
        """
        product_id = str(product.id)
        if product_id not in self.cart.keys():
            self.cart[product_id] = {
                "product_id": product.id,
                "name": product.name,
                "price": int(product.unit_price),
                "quantity": 1,
                "subtotal": int(product.unit_price),
            }
        else:
            if "quantity" in self.cart[product_id]:
                self.cart[product_id]["quantity"] += 1
            else:
                self.cart[product_id]["quantity"] = 1

            if "subtotal" in self.cart[product_id]:
                self.cart[product_id]["subtotal"] = int(
                    int(self.cart[product_id]["subtotal"]) +
                    int(product.unit_price)
                )
            else:
                self.cart[product_id]["subtotal"] = int(product.unit_price)

        self.save_cart()

    def save_cart(self):
        """
        Guarda los cambios realizados en el carro de compras.
        """
        cart_copy = dict(self.cart)
        self.session["cart"] = cart_copy
        self.session.modified = True

    def remove(self, product):
        """
        Elimina un producto del carro de compras.

        Args:
            product (Product): El producto a eliminar.
        """
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save_cart()

    def subtract(self, product):
        """
        Resta la cantidad de un producto del carro de compras.

        Args:
            product (Product): El producto al que se resta la cantidad.
        """
        product_id = str(product.id)
        if product_id in self.cart.keys():
            if "quantity" in self.cart[product_id] and "subtotal" in self.cart[product_id]:
                self.cart[product_id]["quantity"] -= 1
                self.cart[product_id]["subtotal"] = int(
                    int(self.cart[product_id]["subtotal"]) - product.unit_price
                )
                if self.cart[product_id]["quantity"] < 1:
                    self.remove(product)
                else:
                    self.save_cart()

    def clear(self):
        """
        Limpia el carro de compras.
        """
        self.session["cart"] = {}
        self.session.modified = True

    def update_quantity(self, product, quantity):
        """
        Actualiza la cantidad de un producto en el carro de compras.

        Args:
            product (Product): El producto al que se actualiza la cantidad.
            quantity (int): La nueva cantidad del producto.
        """
        product_id = str(product.id)
        if product_id in self.cart.keys():
            self.cart[product_id]["quantity"] = quantity
            self.cart[product_id]["subtotal"] = int(
                int(self.cart[product_id]["quantity"]) * product.unit_price
            )
            if self.cart[product_id]["quantity"] < 1:
                self.remove(product)
                return
            self.save_cart()

    @property
    def items(self):
        """
        Devuelve los elementos del carro de compras.

        Returns:
            list: Lista de los elementos del carro de compras.
        """
        return list(self.cart.values())
