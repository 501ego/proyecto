function confirmCancel(element) {
  let resetCart = element.dataset.resetUrl;
  Swal.fire({
    title: '¿Deseas cancelar la venta?',
    text: 'Esta acción borraría todos los productos del carro',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Cancelado',
        text: 'El carro ha sido vaciado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
        didClose: () => {
          window.location.href = resetCart;
        },
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const confirmSale = () => {
    document
      .getElementById('saleForm')
      .addEventListener('submit', function (e) {
        e.preventDefault();

        const cartIsEmpty = document
          .querySelector('#sell-summary')
          .textContent.includes('No hay productos en el carrito');

        if (cartIsEmpty) {
          Swal.fire({
            title: 'Error',
            text: 'El carrito está vacío',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }
        const documentExist = document.querySelector(
          'input[name="document_name"]:checked'
        );
        const clientExist = document.getElementById('client').value;
        if (!documentExist) {
          Swal.fire({
            title: 'Error',
            text: 'No se ha seleccionado un documento',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        } else {
          const document = documentExist.value;
          if (document === 'Factura' && clientExist === 'Cliente') {
            Swal.fire({
              title: 'Error',
              text: 'Para facturas se debe seleccionar un cliente',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal-confirm-button',
              },
            });
            return;
          }
        }
        Swal.fire({
          title: '¿Deseas concretar la venta?',
          text: 'Esta acción confirmará la venta',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, confirmar',
          cancelButtonText: 'Cancelar',
          customClass: {
            confirmButton: 'swal-confirm-button',
            cancelButton: 'swal-cancel-button',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Venta confirmada',
              text: 'Se ha realizado la venta con éxito',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000,
              didClose: () => {
                e.target.submit();
              },
            });
          }
        });
      });
  };
  confirmSale();

  const deleteButtons = document.querySelectorAll('.delete-item');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Vas a eliminar este producto del carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = this.href;
        }
      });
    });
  });
});
