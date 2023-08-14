document.addEventListener('DOMContentLoaded', function () {
  const searchInputs = [
    {
      inputId: 'search-input-inventory',
      url: '/search-inventory/',
      tableId: 'table-Products',
    },
    {
      inputId: 'search-input-products',
      url: '/search-products/',
      tableId: 'table-Products',
    },
    {
      inputId: 'search-input',
      url: '/search-client/',
      tableId: 'table-clients',
    },
    {
      inputId: 'search-input-sale',
      url: '/search-sale/',
      tableId: 'table-sales',
    },
    {
      inputId: 'search-input-change',
      url: '/search-change/',
      tableId: 'table-changes',
    },
    {
      inputId: 'search-input-jefe',
      url: '/jefe_search/',
      tableId: 'table-sales-jefe',
    },
  ];

  // Función para filtrar la tabla
  function filterTable(searchTerm, url, tableId) {
    const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];

    fetch(`${url}?search=${searchTerm}`)
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Error de conexión.');
      })
      .then((data) => {
        tableBody.innerHTML = data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  for (const input of searchInputs) {
    const searchInputElement = document.getElementById(input.inputId);

    if (searchInputElement) {
      searchInputElement.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        filterTable(searchTerm, input.url, input.tableId);
      });
    }
  }
});
