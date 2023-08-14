function confirmReset(element) {
  let resetForm = element.dataset.resetUrl;
  Swal.fire({
    title: '¿Estás seguro de querer eliminar los datos del formulario?',
    text: 'Esta acción borrará todos los datos del formulario',
    icon: 'warning',
    showCancelButton: true,
    customClass: {
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      swal.fire({
        title: 'Formulario vaciado',
        text: 'Se ha vaciado el formulario con éxito',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
        didClose: () => {
          window.location.href = resetForm;
        },
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const deleteLinks = document.querySelectorAll('.confirm-delete');
  deleteLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const deleteUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar este producto?',
        text: 'Esta acción eliminará o inhabilitará el producto del inventario.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Producto eliminado',
            text: 'Se ha eliminado el producto con éxito',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            window.location.href = deleteUrl;
          });
        }
      });
    });
  });

  const addProd = document.querySelectorAll('.addprod-button');
  addProd.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const inputs = form.querySelectorAll('input');
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() === '') {
          Swal.fire({
            title: 'Campo vacío',
            text: 'Por favor, rellena todos los campos del formulario',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Entendido',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }
      }
      Swal.fire({
        title: '¿Deseas agregar el producto al inventario?',
        text: 'Esta acción agregará el producto al inventario',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Producto agregado',
            text: 'Se ha agregado el producto con éxito',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
            didClose: () => {
              form.submit();
            },
          });
        }
      });
    });
  });

  const updateProd = document.querySelectorAll('.updateprod-button');
  updateProd.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      Swal.fire({
        title: '¿Deseas actualizar el producto del inventario?',
        text: 'Esta acción actualizará el producto en el inventario',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Producto actualizado',
            text: 'Se ha actualizado el producto con éxito',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
            didClose: () => {
              form.submit();
            },
          });
        }
      });
    });
  });

  const editLinks = document.querySelectorAll('.confirm-edit');
  editLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const editUrl = e.target.href;
      {
        Swal.fire({
          title: '¿Estás seguro de que quieres editar este producto?',
          text: 'Esta acción editará el producto',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, editar',
          customClass: {
            confirmButton: 'swal-confirm-button',
            cancelButton: 'swal-cancel-button',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Editando producto',
              text: 'Ahora puede editar el producto',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000,
              didClose: () => {
                window.location.href = editUrl;
              },
            });
          }
        });
      }
    });
  });
});
