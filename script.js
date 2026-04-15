const DATA = {
    restaurantes: [
        { id: 'r1', nombre: 'Pizzería Napoli', cat: 'pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
        { id: 'r2', nombre: 'Sushi Roll', cat: 'asiatica', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
        { id: 'r3', nombre: 'Burger Burger', cat: 'hamburguesas', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' }
    ],
    menu: {
        r1: [{ id: 'm1', n: 'Pizza Margarita', p: 12 }, { id: 'm2', n: 'Pepperoni XL', p: 15 }],
        r2: [{ id: 'm3', n: 'Combo 12pzs', p: 18 }, { id: 'm4', n: 'Ramen', p: 14 }],
        r3: [{ id: 'm5', n: 'Burger Simple', p: 10 }, { id: 'm6', n: 'Bacon Deluxe', p: 13 }]
    }
};

let carrito = []; // Array of { nombre, precio, cantidad }
let infoDireccion = {};

document.addEventListener('DOMContentLoaded', () => {
    renderRestaurantes();
    updateCartBadge();
});

function renderRestaurantes() {
    const container = document.getElementById('lista-restaurantes');
    container.innerHTML = DATA.restaurantes.map(r => `
        <div class="card" onclick="verMenu('${r.id}')">
            <img src="${r.img}" alt="${r.nombre}">
            <div>
                <strong>${r.nombre}</strong>
                <p style="margin:0; font-size:0.8rem; color:grey;">${r.cat.toUpperCase()}</p>
            </div>
        </div>
    `).join('');
}

function verMenu(id) {
    const rest = DATA.restaurantes.find(r => r.id === id);
    document.getElementById('nombre-header-menu').innerText = rest.nombre;
    const container = document.getElementById('lista-platos');
    
    container.innerHTML = DATA.menu[id].map(p => `
        <div class="plato-item">
            <span>${p.n} - <strong>€${p.p}</strong></span>
            <button class="btn" style="width:auto; padding:8px 15px; background:var(--primary); color:white;" 
                    onclick="agregarAlCarrito('${p.n}', ${p.p})">Añadir +</button>
        </div>
    `).join('');
    irAPaso('panel-menu');
}

function agregarAlCarrito(nombre, precio) {
    // Check if item already exists
    const existingItem = carrito.find(item => item.nombre === nombre);
    if (existingItem) {
        existingItem.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    
    // Update cart badge
    updateCartBadge();
    
    // Show toast notification with option to view cart
    lanzarAlerta('¡Producto añadido al carrito! <button onclick="irAPaso(\'panel-carrito\'); this.parentElement.parentElement.remove();" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; padding: 4px 8px; margin-left: 10px; cursor: pointer; font-size: 0.8rem; font-weight: bold;">Ver carrito</button>');
}

function updateCartBadge() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const badge = document.getElementById('cart-badge');
    
    if (totalItems > 0) {
        badge.innerText = totalItems;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function lanzarAlerta(msg) {
    const container = document.getElementById('toast-container');
    
    // Remove existing toasts
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `🛒 ${msg}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000); // Increased time for user to interact
}

function validarDireccion() {
    const calle = document.getElementById('dir-calle').value;
    if(calle.length < 5) {
        alert("Por favor, pon una dirección válida");
        return;
    }
    infoDireccion = {
        calle: calle,
        piso: document.getElementById('dir-piso').value
    };
    renderResumen();
    irAPaso('panel-pago');
}

function renderResumen() {
    const container = document.getElementById('resumen-pedido');
    let total = 0;
    let html = '<h3>Resumen de tu pedido</h3>';
    
    html += carrito.map((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 8px;">
                <div style="flex: 1;">
                    <span>${item.nombre}</span>
                    <br>
                    <span style="font-size: 0.8rem; color: #666;">€${item.precio} c/u</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="min-width: 20px; text-align: center;">x${item.cantidad}</span>
                </div>
                <div style="text-align: right; min-width: 50px;">
                    <strong>€${subtotal}</strong>
                </div>
            </div>
        `;
    }).join('');
    
    if (carrito.length === 0) {
        html += '<p style="text-align: center; color: #666;">Tu carrito está vacío</p>';
    }
    
    html += `<hr><div style="text-align:right; font-weight:bold; font-size: 1.2rem;">Total: €${total}</div>`;
    container.innerHTML = html;
}

function renderCarrito() {
    const container = document.getElementById('contenido-carrito');
    const btnContinuar = document.getElementById('btn-continuar-pedido');
    
    if (carrito.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🛒</div>
                <h3 style="color: #666; margin-bottom: 0.5rem;">Tu carrito está vacío</h3>
                <p style="color: #999; margin-bottom: 2rem;">Agrega algunos productos deliciosos del menú</p>
                <button class="btn btn-ghost" onclick="irAPaso('panel-menu')" style="background: var(--primary); color: white;">Ver Menú</button>
            </div>
        `;
        btnContinuar.style.display = 'none';
        return;
    }
    
    let total = 0;
    let html = '<h3 style="margin-bottom: 1.5rem;">Productos en tu carrito</h3>';
    
    html += carrito.map((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; border: 1px solid #eee;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: bold; margin-bottom: 5px; word-wrap: break-word;">${item.nombre}</div>
                    <div style="font-size: 0.9rem; color: #666;">€${item.precio} c/u</div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                    <button onclick="cambiarCantidad(${index}, -1)" 
                            style="background: #ddd; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">-</button>
                    <span style="min-width: 30px; text-align: center; font-weight: bold; font-size: 1.1rem;">${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)" 
                            style="background: var(--primary); color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">+</button>
                    <button onclick="eliminarItem(${index})" 
                            style="background: #ff4757; color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center;" title="Eliminar">🗑️</button>
                </div>
                <div style="text-align: right; min-width: 60px; flex-shrink: 0;">
                    <div style="font-weight: bold; font-size: 1.1rem;">€${subtotal}</div>
                </div>
            </div>
        `;
    }).join('');
    
    html += `
        <div style="border-top: 2px solid #eee; margin-top: 20px; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.3rem; font-weight: bold;">
                <span>Total:</span>
                <span style="color: var(--primary);">€${total}</span>
            </div>
        </div>
    `;
    container.innerHTML = html;
    btnContinuar.style.display = 'block';
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    updateCartBadge();
    renderCarrito();
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    updateCartBadge();
    renderCarrito();
}

function irAPaso(panelId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(panelId).classList.add('active');
    window.scrollTo(0,0);
    
    // Renderizar contenido específico del panel
    if(panelId === 'panel-carrito') {
        renderCarrito();
    }
    
    if(panelId === 'panel-exito') {
        document.getElementById('dir-final').innerText = `${infoDireccion.calle} (Piso: ${infoDireccion.piso})`;
        // Reset cart on success
        carrito = [];
        updateCartBadge();
    }
}

function lanzarAlerta(msg) {
    const container = document.getElementById('toast-container');
    
    // Remove existing toasts
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `🛒 ${msg}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000); // Increased time for user to interact
}

function validarDireccion() {
    const calle = document.getElementById('dir-calle').value;
    if(calle.length < 5) {
        alert("Por favor, pon una dirección válida");
        return;
    }
    infoDireccion = {
        calle: calle,
        piso: document.getElementById('dir-piso').value
    };
    renderResumen();
    irAPaso('panel-pago');
}

function renderResumen() {
    const container = document.getElementById('resumen-pedido');
    let total = 0;
    let html = '<h3>Resumen de tu pedido</h3>';
    
    html += carrito.map((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 8px;">
                <div style="flex: 1;">
                    <span>${item.nombre}</span>
                    <br>
                    <span style="font-size: 0.8rem; color: #666;">€${item.precio} c/u</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="min-width: 20px; text-align: center;">x${item.cantidad}</span>
                </div>
                <div style="text-align: right; min-width: 50px;">
                    <strong>€${subtotal}</strong>
                </div>
            </div>
        `;
    }).join('');
    
    if (carrito.length === 0) {
        html += '<p style="text-align: center; color: #666;">Tu carrito está vacío</p>';
    }
    
    html += `<hr><div style="text-align:right; font-weight:bold; font-size: 1.2rem;">Total: €${total}</div>`;
    container.innerHTML = html;
}

function renderCarrito() {
    const container = document.getElementById('contenido-carrito');
    const btnContinuar = document.getElementById('btn-continuar-pedido');
    
    if (carrito.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🛒</div>
                <h3 style="color: #666; margin-bottom: 0.5rem;">Tu carrito está vacío</h3>
                <p style="color: #999; margin-bottom: 2rem;">Agrega algunos productos deliciosos del menú</p>
                <button class="btn btn-ghost" onclick="irAPaso('panel-menu')" style="background: var(--primary); color: white;">Ver Menú</button>
            </div>
        `;
        btnContinuar.style.display = 'none';
        return;
    }
    
    let total = 0;
    let html = '<h3 style="margin-bottom: 1.5rem;">Productos en tu carrito</h3>';
    
    html += carrito.map((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; border: 1px solid #eee;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: bold; margin-bottom: 5px; word-wrap: break-word;">${item.nombre}</div>
                    <div style="font-size: 0.9rem; color: #666;">€${item.precio} c/u</div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                    <button onclick="cambiarCantidad(${index}, -1)" 
                            style="background: #ddd; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">-</button>
                    <span style="min-width: 30px; text-align: center; font-weight: bold; font-size: 1.1rem;">${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)" 
                            style="background: var(--primary); color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">+</button>
                    <button onclick="eliminarItem(${index})" 
                            style="background: #ff4757; color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center;" title="Eliminar">🗑️</button>
                </div>
                <div style="text-align: right; min-width: 60px; flex-shrink: 0;">
                    <div style="font-weight: bold; font-size: 1.1rem;">€${subtotal}</div>
                </div>
            </div>
        `;
    }).join('');
    
    html += `
        <div style="border-top: 2px solid #eee; margin-top: 20px; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.3rem; font-weight: bold;">
                <span>Total:</span>
                <span style="color: var(--primary);">€${total}</span>
            </div>
        </div>
    `;
    container.innerHTML = html;
    btnContinuar.style.display = 'block';
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    updateCartBadge();
    renderCarrito();
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    updateCartBadge();
    renderCarrito();
}