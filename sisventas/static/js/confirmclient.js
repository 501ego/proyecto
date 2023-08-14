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
        title: '¿Estás seguro de que quieres eliminar este Cliente?',
        text: 'Esta acción eliminará o inhabilitará el Cliente de la base de datos.',
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
            title: 'Cliente eliminado',
            text: 'Se ha eliminado el Cliente con éxito',
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

  const addProd = document.querySelectorAll('.addcli-button');
  addProd.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const inputs = form.querySelectorAll('input');
      const emailInput = form.querySelector('input[type="email"]');
      const emailValue = emailInput.value.trim() !== '' ? emailInput.value : null;
      console.log(emailValue);
      const rutInput = form.querySelector('input[name="rut"]');
      const rutPattern = /^\d{7,8}-[0-9kK]$/;
      for (let i = 0; i < inputs.length; i++) {
        if ((i >= 0 && i <= 3) || (i >= 6 && i <= 9)) {
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
      }
      if (!rutPattern.test(rutInput.value)) {
        Swal.fire({
          title: 'RUT inválido',
          text: 'Por favor, ingresa un RUT válido (ejemplo: 18251411-k)',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'swal-confirm-button',
          },
        });
        return;
      }
      if (emailValue && emailValue.toString().trim() !== null && !emailInput.validity.valid) {
        Swal.fire({
          title: 'Email inválido',
          text: 'Por favor, ingresa un email válido',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'swal-confirm-button',
          },
        });
        return;
      }
      Swal.fire({
        title: '¿Deseas agregar el Cliente al registro?',
        text: 'Esta acción agregará el Cliente al registro',
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
            title: 'Cliente agregado',
            text: 'Se ha agregado el Cliente con éxito',
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

  const updateprod = document.querySelectorAll('.updatecli-button');
  updateprod.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const inputs = form.querySelectorAll('input');
      const emailInput = form.querySelector('input[type="email"]');
      const emailValue = emailInput.value.trim();
      const rutInput = form.querySelector('input[name="rut"]');
      const rutPattern = /^\d{7,8}-[0-9kK]$/;

      for (let i = 0; i < inputs.length; i++) {
        if ((i >= 0 && i <= 3) || (i >= 6 && i <= 9)) {
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
      }

      if (!rutPattern.test(rutInput.value)) {
        Swal.fire({
          title: 'RUT inválido',
          text: 'Por favor, ingresa un RUT válido (ejemplo: 18251411-k)',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'swal-confirm-button',
          },
        });
        return;
      }

      if (emailValue !== '' && !emailInput.checkValidity()) {
        Swal.fire({
          title: 'Email inválido',
          text: 'Por favor, ingresa un email válido',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'Entendido',
          customClass: {
            confirmButton: 'swal-confirm-button',
          },
        });
        return;
      }

      Swal.fire({
        title: '¿Deseas agregar el Cliente al registro?',
        text: 'Esta acción agregará el Cliente al registro',
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
            title: 'Cliente agregado',
            text: 'Se ha agregado el Cliente con éxito',
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
          title: '¿Estás seguro de que quieres editar este registro de Cliente?',
          text: 'Esta acción editará el registro de Cliente de la base de datos.',
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
              title: 'Editando registro de Cliente',
              text: 'Ahora puede editar el registro de Cliente',
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
