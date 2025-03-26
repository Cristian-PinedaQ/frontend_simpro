// URL de la API que obtiene los datos desde MySQL
const apiUrl = 'http://localhost:8080/api/'; // Reemplaza con la URL de tu API

// Credenciales de autenticación básica
const username = 'cristian'; // Reemplaza con tu usuario
const password = '1234'; // Reemplaza con tu contraseña

// Codificar las credenciales en Base64
const credentials = btoa(`${username}:${password}`);

// Función para mostrar la sección de listado de productos
function listAllProducts() {
    hideAllSections();
    document.getElementById('product-list').style.display = 'block';
    fetchAllProducts();
}

// Función para mostrar la sección de búsqueda de productos
function showProductSearch() {
    hideAllSections();
    document.getElementById('product-search').style.display = 'block';
    fetchAllProductsForSearch(); // Precargar todos los productos
}

// Función para mostrar la sección de creación de productos
function showCreateProductForm() {
    hideAllSections(); // Oculta todas las secciones
    document.getElementById('create-product').style.display = 'block'; // Muestra el formulario
    fetchClientes(); // Cargar la lista de clientes
}

// Función para ocultar todas las secciones
function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}


// Función para obtener y mostrar todos los productos
async function fetchAllProducts() {
    try {
        const response = await fetch(`${apiUrl}productos/findAll`, {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const products = await response.json();
        displayProductTable(products); // Mostrar los productos en una tabla
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('product-table').innerHTML = `<p>Error al cargar los productos: ${error.message}</p>`;
    }
}

// Función para mostrar los productos en una tabla
function displayProductTable(products) {
    const tableContent = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Fecha de Entrega</th>
                    <th>Finalizado</th>
                    <th>Cliente</th>
                    <th>Total Costos</th>
                    <th>Total Abonos</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.price}</td>
                        <td>${product.category}</td>
                        <td>${product.deliveryDate}</td>
                        <td>${product.finish === "true" ? 'Sí' : 'No'}</td>
                        <td>${product.customer.name}</td>
                        <td>${calculateTotalCosts(product.costsList).toLocaleString()}</td>
                        <td>${calculateTotalPayments(product.paymentList).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('product-table').innerHTML = tableContent;
}

// Función para precargar todos los productos y mostrar sus nombres
async function fetchAllProductsForSearch() {
    try {
        const response = await fetch(`${apiUrl}productos/findAll`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const products = await response.json();
        displayProductNames(products); // Mostrar los nombres de los productos
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('search-results').innerHTML = `<p>Error al cargar los productos: ${error.message}</p>`;
    }
}

// Función para mostrar los nombres de los productos en una lista
function displayProductNames(products) {
    const namesContent = `
        <ul>
            ${products.map(product => `
                <li><a href="#" onclick="fetchProductDetails(${product.id})">${product.name}</a></li>
            `).join('')}
        </ul>
    `;

    document.getElementById('search-results').innerHTML = namesContent;
}

// Función para obtener los detalles de un producto por su ID
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`${apiUrl}producto/find/${productId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const product = await response.json();
        displayProductDetails(product); // Mostrar los detalles del producto
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('product-details').innerHTML = `<p>Error al cargar los detalles: ${error.message}</p>`;
    }
}

// 1. Primero definamos setupActionButtons (faltante)
function setupActionButtons(product) {
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');

    // Configurar botón de editar
    editBtn.onclick = () => {
        document.getElementById('edit-form-container').style.display = 'block';
        populateEditForm(product);
    };

    // Configurar botón de eliminar
    deleteBtn.onclick = () => {
        if (confirm(`¿Está seguro de eliminar "${product.name}"?`)) {
            deleteProduct(product.id);
        }
    };
}

// 2. Función para llenar el formulario de edición
function populateEditForm(product) {
    const form = document.getElementById('edit-product-form');
    form.innerHTML = `
        <div class="form-group">
            <label>Nombre:</label>
            <input type="text" name="name" value="${product.name}" required>
        </div>
        <div class="form-group">
            <label>Precio:</label>
            <input type="number" name="price" value="${product.price}" step="0.01" required>
        </div>
        <div class="form-group">
                        <label for="category">Categoría:</label>
                        <select id="category" name="category" required>
                            <option value="">Seleccione una categoria</option>
                            <option value="acabados">Acabados</option>
                            <option value="electricidad">Electricidad</option>
                            <option value="plomeria">Plomeria</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="employee">Empleado:</label>
                        <input type="text" id="employee" name="employee" value="${product.employee}" required>
                    </div>
                    <div class="form-group">
                        <label for="deliveryDate">Fecha de Entrega:</label>
                        <input type="date" id="deliveryDate" name="deliveryDate" value="${product.deliveryDate}" required>
                    </div>
                    <div class="form-group">
                        <label for="finish">Finalizado:</label>
                        <select id="finish" name="finish" required>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <h3>Datos del Cliente:</h3>
                    <h3>${product.customer.name}</h3>
                    <input type="hidden" name="customer" value='${JSON.stringify(product.customer)}'>
                    <input type="hidden" name="id_customer" value="${product.customer.id}">
        <button type="submit" class="btn-update">Actualizar Producto</button>
    `;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updatedData = {
            ...Object.fromEntries(formData),
            customer: JSON.parse(formData.get('customer')),
            id_customer: formData.get('id_customer')
        };
        await updateProduct(product.id, updatedData);
    };
}

// 3. Función para actualizar producto
async function updateProduct(id, productData) {
    try {
        // Convertir finish a booleano si es necesario
        if (productData.finish) {
            productData.finish = productData.finish === 'true';
        }

        const response = await fetch(`${apiUrl}producto/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en actualización');
        }

        alert('Producto actualizado correctamente!');
        document.getElementById('edit-form-container').style.display = 'none';
        fetchProductDetails(id); // Refrescar los datos
        
    } catch (error) {
        console.error('Error en updateProduct:', error);
        alert(`Error al actualizar: ${error.message}`);
    }
}

// 4. Función para eliminar producto
async function deleteProduct(id) {
    try {
        const response = await fetch(`${apiUrl}producto/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });

        if (!response.ok) throw new Error('Error al eliminar');
        
        alert('Producto eliminado');
        document.getElementById('product-details').style.display = 'none';
        // Recargar la lista de productos
        fetchAllProductsForSearch(); 
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// 5. Función displayProductDetails actualizada
function displayProductDetails(product) {
    const detailContent = document.getElementById('product-detail-content');
    
    if (!detailContent) {
        console.error('Error: Elemento product-detail-content no encontrado');
        return;
    }

    try {
        detailContent.innerHTML = `
            <p><strong>Nombre:</strong> ${product.name}</p>
            <p><strong>Precio:</strong> ${product.price}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>Empleado:</strong> ${product.employee}</p>
            <p><strong>Fecha Entrega:</strong> ${product.deliveryDate}</p>
            <p><strong>Estado:</strong> ${product.finish === "true" ? 'Completado' : 'Pendiente'}</p>
            <h4>Cliente:</h4>
            <p>${product.customer.name} (${product.customer.document})</p>
        `;

        document.getElementById('product-details').style.display = 'block';
        setupActionButtons(product); // Ahora esta función existe
        
    } catch (error) {
        console.error('Error al mostrar detalles:', error);
    }
}

// Función para manejar el envío del formulario
document.getElementById('create-product-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const productData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value,
        employee: document.getElementById('employee').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        finish: document.getElementById('finish').value,
        customer: {
            id: parseInt(document.getElementById('customerId').value)
        }
    };

    // Enviar los datos al backend
    await createProduct(productData);
});

/// Función para crear un nuevo producto
async function createProduct(productData) {
    try {
        const response = await fetch(`${apiUrl}producto/save`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        // Verificar si la respuesta es válida
        if (!response.ok) {
            const errorText = await response.text(); // Leer el cuerpo de la respuesta como texto
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        // Intentar parsear la respuesta como JSON
        const result = await response.json();
        alert('Producto creado exitosamente');
        console.log('Producto creado:', result);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error al crear el producto: ${error.message}`);
    }
}
// Función para calcular la suma de los costos
function calculateTotalCosts(costsList) {
    return costsList.reduce((total, cost) => total + cost.price, 0);
}

// Función para calcular la suma de los abonos
function calculateTotalPayments(paymentList) {
    return paymentList.reduce((total, payment) => total + payment.price, 0);
}

// URL de la API para obtener clientes
const clientesApiUrl = 'http://localhost:8080/api/clientes'; // Reemplaza con la URL de tu API

// Función para obtener y mostrar los clientes en el campo de selección
async function fetchClientes() {
    try {
        const response = await fetch(`${clientesApiUrl}/findAll`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const clientes = await response.json();
        displayClientes(clientes); // Mostrar los clientes en el campo de selección
    } catch (error) {
        console.error('Error:', error);
        alert(`Error al cargar los clientes: ${error.message}`);
    }
}

// Función para mostrar los clientes en el campo de selección
function displayClientes(clientes) {
    const customerSelect = document.getElementById('customerSelect');

    // Limpiar el campo de selección
    customerSelect.innerHTML = '<option value="">Seleccione un cliente</option>';

    // Agregar cada cliente como una opción
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id; // El valor será el ID del cliente
        option.textContent = cliente.name; // El texto será el nombre del cliente
        customerSelect.appendChild(option);
    });

    // Manejar la selección de un cliente
    customerSelect.addEventListener('change', (event) => {
        const selectedId = event.target.value; // Obtener el ID del cliente seleccionado
        const customerIdInput = document.getElementById('customerId'); // Referencia al campo oculto
        if (customerIdInput) {
            customerIdInput.value = selectedId; // Asignar el ID al campo oculto
        } else {
            console.error('El campo customerId no fue encontrado en el DOM.');
        }
    });
}

// Al final de tu script.js, añade:
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Elementos disponibles:', {
        details: document.getElementById('product-details'),
        content: document.getElementById('product-detail-content')
    });
});
