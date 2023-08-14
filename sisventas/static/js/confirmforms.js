document.addEventListener('DOMContentLoaded', () => {
  // GENERO FORMS
  const resetGenre = document.querySelector('#reset-genre');
  if (resetGenre) {
    resetGenre.addEventListener('click', (e) => {
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

  const updateGenre = document.querySelectorAll('.update-genre');
  updateGenre.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input = form.querySelector('input[name="description"]');
      if (input.value === '' || input.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      Swal.fire({
        title: '¿Estás seguro de que quieres actualizar este género?',
        text: 'Esta acción actualizará el género en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const addGenre = document.querySelectorAll('.add-genre');
  addGenre.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input = form.querySelector('input[name="description"]');

      if (input.value === '' || input.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
      Swal.fire({
        title: '¿Estás seguro de que quieres añadir este género?',
        text: 'Esta acción añadirá el género a la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, añadir',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const deleteGenre = document.querySelectorAll('.delete-genre');
  deleteGenre.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const deleteUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar este género?',
        text: 'Esta acción eliminará el género de la base de datos.',
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
            title: 'Género eliminado',
            text: 'Se ha eliminado el género con éxito',
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

  const editGenre = document.querySelectorAll('.edit-genre');
  editGenre.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const editUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres editar este género?',
        text: 'Esta acción editará el género en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, editar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = editUrl;
        }
      });
    });
  });

  // Profile

  const resetProfile = document.querySelector('#reset-profile');
  if (resetProfile) {
    resetProfile.addEventListener('click', (e) => {
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

  const updateProfile = document.querySelectorAll('.update-profile');
  updateProfile.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input = form.querySelector('input[name="name"]');
      if (input.value === '' || input.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      Swal.fire({
        title: '¿Estás seguro de que quieres actualizar este Perfil?',
        text: 'Esta acción actualizará el Perfil en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const addProfile = document.querySelectorAll('.add-profile');
  addProfile.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input = form.querySelector('input[name="name"]');

      if (input.value === '' || input.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
      Swal.fire({
        title: '¿Estás seguro de que quieres añadir este Perfil?',
        text: 'Esta acción añadirá el Perfil a la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, añadir',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const deleteProfile = document.querySelectorAll('.delete-profile');
  deleteProfile.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const deleteUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar este Perfil?',
        text: 'Esta acción eliminará el Perfil de la base de datos.',
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
            title: 'Perfil eliminado',
            text: 'Se ha eliminado el Perfil con éxito',
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

  const editProfile = document.querySelectorAll('.edit-profile');
  editProfile.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const editUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres editar este Perfil?',
        text: 'Esta acción editará el Perfil en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, editar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = editUrl;
        }
      });
    });
  });
  // IVA

  const resetIVA = document.querySelector('#reset-iva');
  if (resetIVA) {
    resetIVA.addEventListener('click', (e) => {
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

  const updateIVA = document.querySelectorAll('.update-iva');
  updateIVA.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input = form.querySelector('input[name="value"]');
      if (input.value === '' || input.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      Swal.fire({
        title: '¿Estás seguro de que quieres actualizar el valor del IVA?',
        text: 'Esta acción actualizará el valor del IVA en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const addIVA = document.querySelectorAll('.add-iva');
  addIVA.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input = form.querySelector('input[name="value"]');

      if (input.value === '' || input.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
      Swal.fire({
        title: '¿Estás seguro de que quieres añadir un nuevo IVA?',
        text: 'Esta acción añadirá el IVA a la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, añadir',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const deleteIVA = document.querySelectorAll('.delete-iva');
  deleteIVA.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const deleteUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar este valor de IVA?',
        text: 'Esta acción eliminará el IVA de la base de datos.',
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
            title: 'IVA eliminado',
            text: 'Se ha eliminado el IVA con éxito',
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

  const editIVA = document.querySelectorAll('.edit-iva');
  editIVA.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const editUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres editar este IVA?',
        text: 'Esta acción editará el IVA en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, editar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = editUrl;
        }
      });
    });
  });

  // REGION FORMS
  const resetRegion = document.querySelector('#reset-region');
  if (resetRegion) {
    resetRegion.addEventListener('click', (e) => {
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

  const updateRegion = document.querySelectorAll('.update-region');
  updateRegion.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input = form.querySelector('input[name="name"]');
      if (input.value === '' || input.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      Swal.fire({
        title: '¿Estás seguro de que quieres actualizar esta Región?',
        text: 'Esta acción actualizará la Región en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const addRegion = document.querySelectorAll('.add-region');
  addRegion.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input = form.querySelector('input[name="name"]');

      if (input.value === '' || input.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
      Swal.fire({
        title: '¿Estás seguro de que quieres añadir esta Región?',
        text: 'Esta acción añadirá la Región a la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, añadir',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const deleteRegion = document.querySelectorAll('.delete-region');
  deleteRegion.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const deleteUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar esta Región?',
        text: 'Esta acción eliminará la Región de la base de datos.',
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
            title: 'Región eliminado',
            text: 'Se ha eliminado la Región con éxito',
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

  const editRegion = document.querySelectorAll('.edit-region');
  editRegion.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const editUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres editar esta Región?',
        text: 'Esta acción editará la Región en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, editar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = editUrl;
        }
      });
    });
  });
  // CIUDAD FORMS
  const resetCiudad = document.querySelector('#reset-ciudad');
  if (resetCiudad) {
    resetCiudad.addEventListener('click', (e) => {
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

  const updateCiudad = document.querySelectorAll('.update-ciudad');
  updateCiudad.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input_name = form.querySelector('input[name="name"]');
      const input_region = form.querySelector('select[name="id_region"]');
      if (input_name.value === '' || input_name.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo Nombre de la Ciudad no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      } else if (input_region.value === '' || input_region.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo ID Región no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      Swal.fire({
        title: '¿Estás seguro de que quieres actualizar esta Ciudad?',
        text: 'Esta acción actualizará la Ciudad en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const addCiudad = document.querySelectorAll('.add-ciudad');
  addCiudad.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input_name = form.querySelector('input[name="name"]');
      const input_region = form.querySelector('select[name="id_region"]');

      if (input_name.value === '' || input_name.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo Nombre de Ciudad no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      } else if (input_region.value === '' || input_region.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo Región no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
      Swal.fire({
        title: '¿Estás seguro de que quieres añadir esta Ciudad?',
        text: 'Esta acción añadirá la Ciudad a la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, añadir',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const deleteCiudad = document.querySelectorAll('.delete-ciudad');
  deleteCiudad.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const deleteUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar esta Ciudad?',
        text: 'Esta acción eliminará la Ciudad de la base de datos.',
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
            title: 'Ciudad eliminada',
            text: 'Se ha eliminado la Ciudad con éxito',
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

  const editCiudad = document.querySelectorAll('.edit-ciudad');
  editCiudad.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const editUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres editar esta Ciudad?',
        text: 'Esta acción editará la Ciudad en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, editar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = editUrl;
        }
      });
    });
  });

  // COMUNA FORMS
  const resetComuna = document.querySelector('#reset-comuna');
  if (resetComuna) {
    resetComuna.addEventListener('click', (e) => {
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

  const updateComuna = document.querySelectorAll('.update-comuna');
  updateComuna.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input_name = form.querySelector('input[name="name"]');
      const input_ciudad = form.querySelector('select[name="id_city"]');

      if (input_name.value === '' || input_name.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo Nombre de Comuna no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      } else if (input_ciudad.value === '' || input_ciudad.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo Ciudad no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
      Swal.fire({
        title: '¿Estás seguro de que quieres actualizar esta Comuna?',
        text: 'Esta acción actualizará la Comuna a la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, añadir',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const addComuna = document.querySelectorAll('.add-comuna');
  addComuna.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const form = link.closest('form');
      const input_name = form.querySelector('input[name="name"]');
      const input_ciudad = form.querySelector('select[name="id_city"]');

      if (input_name.value === '' || input_name.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo Nombre de Comuna no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      } else if (input_ciudad.value === '' || input_ciudad.value === null) {
        Swal.fire({
          title: 'Error',
          text: 'El campo Ciudad no puede estar vacío',
          icon: 'error',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
      Swal.fire({
        title: '¿Estás seguro de que quieres añadir esta Comuna?',
        text: 'Esta acción añadirá la Comuna a la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, añadir',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  const deleteComuna = document.querySelectorAll('.delete-comuna');
  deleteComuna.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const deleteUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar esta Comuna?',
        text: 'Esta acción eliminará la Comuna de la base de datos.',
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
            title: 'Comuna eliminada',
            text: 'Se ha eliminado la Comuna con éxito',
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

  const editComuna = document.querySelectorAll('.edit-comuna');
  editComuna.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const editUrl = e.target.href;
      Swal.fire({
        title: '¿Estás seguro de que quieres editar esta Comuna?',
        text: 'Esta acción editará la Comuna en la base de datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, editar',
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = editUrl;
        }
      });
    });
  });
});
