let cart = JSON.parse(localStorage.getItem('cart')) || {};
const sideCart = document.getElementById('side-cart');

function toggleCart() {
    sideCart.classList.toggle('open');
}

function addToCart(name, price) {
    if (cart[name]) {
        cart[name].quantity += 1;
    } else {
        cart[name] = {
            name: name,
            price: price,
            quantity: 1
        };
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateSideCart();
    // Abre o carrinho automaticamente quando adiciona um item
    sideCart.classList.add('open');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-float-count');
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateSideCart() {
    const cartItemsContainer = document.getElementById('side-cart-items');
    const cartTotal = document.getElementById('side-cart-total');
    let total = 0;

    cartItemsContainer.innerHTML = '';

    if (Object.keys(cart).length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Seu carrinho está vazio</p>
                <p>Adicione alguns pães de queijo deliciosos!</p>
            </div>
        `;
        cartTotal.textContent = 'R$ 0,00';
        return;
    }

    for (const [name, item] of Object.entries(cart)) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'side-cart-item';
        itemElement.innerHTML = `
            <div class="side-cart-item-info">
                <div class="side-cart-item-name">${name}</div>
                <div class="side-cart-item-price">R$ ${item.price.toFixed(2)}</div>
            </div>
            <div class="side-cart-item-quantity">
                <button class="quantity-btn minus" onclick="changeQuantity(event, '${name}', -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" onclick="changeQuantity(event, '${name}', 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    }

    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

function changeQuantity(event, name, change) {
    event.stopPropagation();
    
    if (cart[name]) {
        const newQuantity = cart[name].quantity + change;
        if (newQuantity > 0) {
            cart[name].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateSideCart();
            updateCartCount();
        } else if (newQuantity === 0) {
            delete cart[name];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateSideCart();
            updateCartCount();
        }
    }
}

function sendWhatsApp() {
    if (Object.keys(cart).length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    let message = 'Olá! Gostaria de fazer um pedido:\n\n';
    let total = 0;
    
    for (const [name, item] of Object.entries(cart)) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${name} x${item.quantity} - R$ ${itemTotal.toFixed(2)}\n`;
    }
    
    message += `\nTotal: R$ ${total.toFixed(2)}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5531996519655?text=${encodedMessage}`, '_blank');
}

// Inicializa o carrinho quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || {};
    updateCartCount();
    updateSideCart();
});

// Fecha o carrinho quando clica fora, mas não quando clica dentro do carrinho
document.addEventListener('click', (e) => {
    if (sideCart.classList.contains('open') && 
        !sideCart.contains(e.target) && 
        !e.target.closest('.cart-float-button') &&
        !e.target.closest('.quantity-btn')) {
        sideCart.classList.remove('open');
    }
});
