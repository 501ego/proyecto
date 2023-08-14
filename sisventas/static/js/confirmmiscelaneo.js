document.addEventListener('DOMContentLoaded', function () {
  // AUTH
  const csrftoken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
  const authButton = document.getElementById('auth-button');

  if (authButton) {
    authButton.addEventListener('click', function (e) {
      e.preventDefault();
      const credentialsForm = this.closest('form');
      const authuser = document.querySelector('input[name="authuser"]');
      const password = document.querySelector('input[name="password"]');

      if (!authuser.value) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, ingrese RUT',
          icon: 'error',
        });
        return;
      } else if (!password.value) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, ingrese contraseña',
          icon: 'error',
        });
        return;
      }
      const credentialsData = `authuser=${encodeURIComponent(authuser.value)}&password=${encodeURIComponent(password.value)}`;

      fetch(credentialsForm.action, {
        method: 'POST',
        body: credentialsData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': csrftoken,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          if (data.authorized === 'true') {
            document.getElementById('isAuthorized').value = 'true';
            Swal.fire({
              title: 'Autorizado',
              text: 'Credenciales correctas',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
              didClose: () => {
                $('#ModalToggle').modal('hide');
              },
            });
          } else if (data.authorized === 'false') {
            Swal.fire({
              title: 'Error',
              text: 'Credenciales incorrectas',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000,
            });
          } else if (data.error === 'Usuario no existe') {
            Swal.fire({
              title: 'Error',
              text: 'El rut de empleado no existe en la base de datos',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000,
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  }

  //Change product
  const changeProd = document.querySelectorAll('.change');

  changeProd.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const itemGroups = Array.from(form.querySelectorAll('.item-group_change'));
      const checkedItemGroups = itemGroups.filter((group) => group.querySelector('input[name="checked_items"]:checked'));

      if (checkedItemGroups.length === 0) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, seleccione al menos un producto',
          icon: 'error',
          customClass: {
            confirmButton: 'swal-confirm-button',
            cancelButton: 'swal-cancel-button',
          },
        });
        return;
      }

      const quantities = checkedItemGroups.map((group) => group.querySelector('input[name="quantity"]').value);

      if (quantities.includes('') || quantities.includes('0')) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, ingrese la cantidad para todos los productos seleccionados',
          icon: 'error',
          customClass: {
            confirmButton: 'swal-confirm-button',
            cancelButton: 'swal-cancel-button',
          },
        });
        return;
      }

      if (quantities.some((qty, i) => Number(qty) > checkedItemGroups[i].querySelector('input[name="quantity"]').max)) {
        Swal.fire({
          title: 'Error',
          text: 'La cantidad ingresada no puede ser mayor a la cantidad disponible del producto',
          icon: 'error',
          customClass: {
            confirmButton: 'swal-confirm-button',
            cancelButton: 'swal-cancel-button',
          },
        });
        return;
      }

      $('#ModalToggle').modal('show');
    });
  });

  $(document).ready(function () {
    if ($('#ModalToggle').length > 0) {
      $('#ModalToggle').on('hidden.bs.modal', function (e) {
        const authorized = document.getElementById('isAuthorized');

        if (authorized.value === 'true') {
          const form = document.querySelector('#change');
          Swal.fire({
            title: 'Procesando cambio',
            text: 'Por favor, espere...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            timer: 1000,
            didClose: () => {
              var formData = new FormData(form);
              formData.append('authorized', authorized.value);
              fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                  'X-Requested-With': 'XMLHttpRequest',
                  'X-CSRFToken': csrftoken,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  var message = data.message;
                  if (message !== '') {
                    if (message === 'success') {
                      Swal.fire({
                        title: 'Cambio realizado',
                        text: 'El cambio se ha realizado con éxito',
                        icon: 'success',
                        showConfirmButton: false,
                        customClass: {
                          confirmButton: 'swal-confirm-button',
                          cancelButton: 'swal-cancel-button',
                        },
                        timer: 2000,
                        didClose: () => {
                          form.reset();
                          window.location.reload();
                        },
                      });
                    } else if (message === 'error') {
                      Swal.fire({
                        title: 'Error',
                        text: 'Ha ocurrido un error, probablemente ya se ha realizado un cambio asociado a esta venta',
                        icon: 'error',
                        showConfirmButton: false,
                        customClass: {
                          confirmButton: 'swal-confirm-button',
                          cancelButton: 'swal-cancel-button',
                        },
                        timer: 2000,
                      });
                    }
                  }
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            },
          });
        }
      });
    }

    //Confirm Empleado
    const confirmEmp = document.querySelectorAll('.add-employee');

    confirmEmp.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const form = link.closest('form');
        const rut = form.querySelector('input[name="rut"]');
        const name = form.querySelector('input[name="name"]');
        const last_name = form.querySelector('input[name="last_name"]');
        const id_genre = form.querySelector('select[name="id_genre"]');
        const birth_date = form.querySelector('input[name="birth_date"]');
        const email = form.querySelector('input[name="email"]');
        const phone = form.querySelector('input[name="phone"]');
        const street = form.querySelector('input[name="street"]');
        const id_region = form.querySelector('select[name="id_region"]');
        const id_city = form.querySelector('select[name="id_city"]');
        const id_commune = form.querySelector('select[name="id_commune"]');
        const is_employee = form.querySelector('input[name="is_employee"]');
        console.log(is_employee.value);
        console.log(is_employee.value);
        console.log(is_employee.value);
        const id_profile = form.querySelector('select[name="id_profile"]');
        const password1 = form.querySelector('input[name="password1"]');
        const password2 = form.querySelector('input[name="password2"]');
        const rutPattern = /^\d{7,8}-[0-9kK]$/;
        const emailValue = email.value.trim() !== '' ? email.value : null;
        if (rut.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese el rut',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (!rutPattern.test(rut.value)) {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un RUT válido (ejemplo: 18251411-k)',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (name.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese el nombre',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (last_name.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese el apellido',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (id_genre.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese el género',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (birth_date.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese la fecha de nacimiento',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (email.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese el correo electrónico',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (emailValue && emailValue.toString().trim() !== null && !email.validity.valid) {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un correo electrónico válido',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (phone.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese el teléfono',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (street.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese la dirección',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (id_region.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese la región',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (id_city.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese la ciudad',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (id_commune.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese la comuna',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (id_profile.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese el perfil',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (password1.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese la contraseña',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (password2.value === '') {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese la confirmación de la contraseña',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (password1.value !== password2.value) {
          Swal.fire({
            title: 'Error',
            text: 'Las contraseñas no coinciden',
            icon: 'error',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
          });
          return;
        }

        if (is_employee.value === 'on') {
          Swal.fire({
            title: 'alerta',
            text: 'Por favor, asegurese de marcar la casilla de empleado',
            icon: '',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swal-confirm-button',
            },
            didClose: () => {
              $('#ModalToggle').modal('show');
            },
          });
        }

        $(document).ready(function () {
          if ($('#ModalToggle').length > 0) {
            $('#ModalToggle').on('hidden.bs.modal', function (e) {
              const authorized = document.getElementById('isAuthorized');
              if (authorized.value === 'true') {
                Swal.fire({
                  title: 'Éxito',
                  text: 'Datos de Empleado ingresados correctamente',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                  customClass: {
                    confirmButton: 'swal-confirm-button',
                  },
                  didClose: () => {
                    form.submit();
                  },
                });
              } else {
                Swal.fire({
                  title: 'Error',
                  text: 'No se pudo ingresar los datos del Empleado',
                  icon: 'error',
                  confirmButtonText: 'Ok',
                  customClass: {
                    confirmButton: 'swal-confirm-button',
                  },
                });
              }
            });
          }
        });
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
          title: '¿Estás seguro de que quieres editar el registro de Empleado?',
          text: 'Esta acción editará el registro de Empleado de la base de datos.',
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
              title: 'Editando registro de Empleado',
              text: 'Ahora puede editar el registro de Empleado',
              icon: 'success',
              showConfirmButton: false,
              customClass: {
                confirmButton: 'swal-confirm-button',
                cancelButton: 'swal-cancel-button',
              },
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

  const deleteLinks = document.querySelectorAll('.confirm-delete');
  deleteLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const deleteUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar este Empleado?',
        text: 'Esta acción eliminará o inhabilitará el Empleado de la base de datos.',
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
            title: 'Empleado eliminado',
            text: 'Se ha eliminado el Empleado con éxito',
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

  const resetEmployee = document.querySelector('#reset-employee');
  if (resetEmployee) {
    resetEmployee.addEventListener('click', (e) => {
      e.preventDefault();
      const deleteUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres vaciar el formulario?',
        text: 'Esta acción eliminará todos los datos del formulario.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Formulario vaciado',
            text: 'Se ha vaciado el formulario con éxito',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
            didClose: () => {
              window.location.href = deleteUrl;
            },
          });
        }
      });
    });
  }

  // Credentials
  const credentials = document.querySelectorAll('.update-credentials');
  credentials.forEach((credential) => {
    credential.addEventListener('click', function (e) {
      e.preventDefault();
      var form = e.target.closest('form');
      const oldPassword = form.querySelector('input[name="old_password"]');
      const newPassword1 = form.querySelector('input[name="new_password1"]');
      const newPassword2 = form.querySelector('input[name="new_password2"]');

      if (oldPassword.value === '' || newPassword1.value === '' || newPassword2.value === '') {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, complete todos los campos',
          icon: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'swal-confirm-button',
          },
        });
        return;
      } else if (newPassword1.value !== newPassword2.value) {
        Swal.fire({
          title: 'Error',
          text: 'Las contraseñas no coinciden',
          icon: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'swal-confirm-button',
          },
        });
        return;
      }
      Swal.fire({
        title: 'procesando',
        text: 'Espere un momento por favor',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        timer: 1000,
        didClose: () => {
          var formData = new FormData(form);
          fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRFToken': csrftoken,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((data) => {
              var message = data.message;
              if (message !== '') {
                if (message === 'success') {
                  Swal.fire({
                    title: 'Contraseña actualizada',
                    text: 'Se ha actualizado la contraseña con éxito',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000,
                  }).then(() => {
                    if (data.redirect_url) {
                      window.location.href = data.redirect_url;
                    }
                  });
                } else if (message === 'error') {
                  Swal.fire({
                    title: 'Error',
                    text: 'Contraseña anterior inválida, por favor intente nuevamente',
                    icon: 'error',
                    showConfirmButton: false,
                    customClass: {
                      confirmButton: 'swal-confirm-button',
                      cancelButton: 'swal-cancel-button',
                    },
                    timer: 2000,
                  });
                }
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        },
      });
    });
  });

  //Print
  var sales = document.querySelectorAll('#print');
  for (var i = 0; i < sales.length; i++) {
    var sale = sales[i];
    sale.addEventListener('click', printSale);
  }

  function printSale(event) {
    event.preventDefault();

    Swal.fire({
      title: '¿Deseas imprimir el Documento de venta?',
      text: 'Vas a imprimir el Documento de venta',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, imprimir',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = event.target.href;
      }
    });
  }
});

function checkInputs(event) {
  event.preventDefault();
  const form = event.target.closest('form');
  const todayInput = document.getElementById('today');
  const weekInput = document.getElementById('week');
  const monthInput = document.getElementById('month');
  if (!todayInput.checked && !weekInput.checked && !monthInput.checked) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor, seleccione una opción',
      icon: 'error',
      confirmButtonText: 'Ok',
      customClass: {
        confirmButton: 'swal-confirm-button',
      },
    });
    return;
  } else {
    form.submit();
  }
}

function authIni(event) {
  event.preventDefault();
  var url = event.target.href;

  $('#ModalToggle').modal('show');

  $(document).ready(function () {
    if ($('#ModalToggle').length > 0) {
      $('#ModalToggle').on('hidden.bs.modal', function (e) {
        var authorized = document.getElementById('isAuthorized').value;

        if (authorized === 'true') {
          Swal.fire({
            title: 'Iniciando Jornada de Ventas',
            text: 'Ahora el sistema está habilitado para realizar ventas...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            customClass: {
              confirmButton: 'swal-confirm-button',
              cancelButton: 'swal-cancel-button',
            },
            timer: 2000,
            didClose: () => {
              window.location.href = url;
            },
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error al autorizar, por favor, intente nuevamente...',
            icon: 'error',
            showConfirmButton: false,
            timer: 1000,
          });
          return;
        }
      });
    }
  });
}

function authEnd(event) {
  event.preventDefault();
  var url = event.target.href;

  $('#ModalToggle').modal('show');

  $(document).ready(function () {
    if ($('#ModalToggle').length > 0) {
      $('#ModalToggle').on('hidden.bs.modal', function (e) {
        var authorized = document.getElementById('isAuthorized').value;

        if (authorized === 'true') {
          Swal.fire({
            title: 'Finalizando Jornada de Ventas',
            text: 'Ahora el sistema está deshabilitado para realizar ventas...',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            customClass: {
              confirmButton: 'swal-confirm-button',
              cancelButton: 'swal-cancel-button',
            },
            timer: 2000,
            didClose: () => {
              window.location.href = url;
            },
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error al autorizar, por favor, intente nuevamente...',
            icon: 'error',
            showConfirmButton: false,
            timer: 1000,
          });
          return;
        }
      });
    }
  });
}

function resetPassword(event) {
  event.preventDefault();
  const url = event.target.href;
  Swal.fire({
    title: '¿Estás seguro de que quieres vaciar el formulario?',
    text: 'Esta acción eliminará todos los datos del formulario.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, vaciar',
    customClass: {
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Formulario vaciado',
        text: 'Se ha vaciado el formulario con éxito',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
        didClose: () => {
          window.location.href = url;
        },
      });
    }
  });
}
