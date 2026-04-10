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

let carrito = [];
let infoDireccion = {};

document.addEventListener('DOMContentLoaded', () => {
    renderRestaurantes();
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
    carrito.push({ nombre, precio });
    
    // 1. Actualizar contador flotante
    document.getElementById('count-carrito').innerText = carrito.length;
    document.getElementById('btn-flotante-carrito').style.display = 'block';
    
    // 2. Lanzar mini alerta (Toast)
    lanzarAlerta(`Añadido: ${nombre}`);
}

function lanzarAlerta(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `🛒 ${msg}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
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
    let html = carrito.map(i => {
        total += i.precio;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span>${i.nombre}</span> <span>€${i.precio}</span>
                </div>`;
    }).join('');
    
    html += `<hr><div style="text-align:right; font-weight:bold;">Total: €${total}</div>`;
    container.innerHTML = html;
}

function irAPaso(panelId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(panelId).classList.add('active');
    window.scrollTo(0,0);
    
    if(panelId === 'panel-exito') {
        document.getElementById('dir-final').innerText = `${infoDireccion.calle} (Piso: ${infoDireccion.piso})`;
        document.getElementById('btn-flotante-carrito').style.display = 'none';
    }
}