document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleccionar elementos clave del DOM
    const productsContainer = document.getElementById('lista-productos');
    const cartItemsContainer = document.getElementById('items-carrito');
    const totalDisplay = document.getElementById('total-precio');
    const whatsappButton = document.getElementById('enviar-whatsapp');
    const clearCartButton = document.getElementById('limpiar-carrito');

    // Array para almacenar los productos en el carrito
    let cart = [];

    // 2. Función para actualizar la visualización del carrito
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Limpiar el contenido actual del carrito
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                // Crear un elemento div para cada ítem en el carrito
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('carrito-item');
                cartItemDiv.innerHTML = `
                    <div class="carrito-item-info">
                        <span class="item-nombre">${item.name}</span>
                        <span class="item-cantidad-precio">${item.quantity} x Bs${item.price.toFixed(2)} = Bs${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                    <button class="eliminar-item" data-name="${item.name}">Eliminar</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);

                total += item.quantity * item.price;
            });
        }

        totalDisplay.textContent = total.toFixed(2); // Actualizar el total en pantalla
    }

    // 3. Manejador de eventos para añadir productos al carrito
    productsContainer.addEventListener('click', (event) => {
        // Verificar si el clic fue en un botón 'Añadir al Carrito'
        if (event.target.classList.contains('agregar-carrito')) {
            const productName = event.target.dataset.nombre;
            const productPrice = parseFloat(event.target.dataset.precio);

            // Buscar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.name === productName);

            if (existingItem) {
                // Si existe, aumentar la cantidad
                existingItem.quantity++;
            } else {
                // Si no existe, añadirlo como un nuevo ítem
                cart.push({
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            updateCartDisplay(); // Actualizar la interfaz del carrito
        }
    });

    // 4. Manejador de eventos para eliminar productos del carrito
    cartItemsContainer.addEventListener('click', (event) => {
        // Verificar si el clic fue en un botón 'Eliminar'
        if (event.target.classList.contains('eliminar-item')) {
            const productName = event.target.dataset.name;

            // Filtrar el carrito para remover el producto
            // Esto crea un nuevo array sin el producto a eliminar
            cart = cart.filter(item => item.name !== productName);
            updateCartDisplay(); // Actualizar la interfaz del carrito
        }
    });

    // 5. Manejador de eventos para limpiar todo el carrito
    clearCartButton.addEventListener('click', () => {
        cart = []; // Vaciar el array del carrito
        updateCartDisplay(); // Actualizar la interfaz
        alert('El carrito ha sido vaciado.');
    });

    // 6. Manejador de eventos para enviar el pedido por WhatsApp
    whatsappButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Por favor, añade algunos productos antes de enviar el pedido.');
            return;
        }

        let message = "¡Hola! Me gustaría hacer el siguiente pedido de Manjar de Oro:\n\n";
        let total = 0;

        cart.forEach(item => {
            message += `- "${item.name}" x ${item.quantity} = Bs. ${(item.quantity * item.price).toFixed(2)}\n`;
            total += item.quantity * item.price;
        });

        message += `\nTotal a pagar: Bs. ${total.toFixed(2)}`;
        message += "\n\n¡Espero tu confirmación! y QR para realizar el Pago Por Favor!";

        // Codificar el mensaje para la URL de WhatsApp
        const encodedMessage = encodeURIComponent(message);
        // Aquí puedes poner el número de WhatsApp de tu negocio (sin '+' ni espacios)
        const whatsappNumber = "59176248462"; // Ejemplo: 591 78912345 para Bolivia

        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Abrir WhatsApp en una nueva pestaña
        window.open(whatsappURL, '_blank');
    });

    // Inicializar la visualización del carrito al cargar la página
    updateCartDisplay();
});