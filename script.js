
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];


const SHEETDB_API_URL = 'YOUR_SHEETDB_API_ENDPOINT_URL_HERE'; 



function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}


function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

/**
 * Adds an item to the cart or increments the quantity if it already exists.
 * @param {number} productId - Unique ID of the product.
 * @param {number} quantity - Quantity to add (default is 1).
 */
function addToCart(productId, quantity = 1) {

    quantity = parseInt(quantity);
    if (quantity < 1) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {

        let name, price;
        if (productId === 101) { name = 'Nova Pro Headphones'; price = 249.00; }
        else if (productId === 102) { name = 'Compact Mech Keyboard'; price = 120.00; }
        else if (productId === 103) { name = 'Aura Smartwatch Z'; price = 329.99; }
        else if (productId === 201) { name = 'XPS 13 Ultra Laptop'; price = 999.99; }
        else if (productId === 202) { name = 'Noise-Cancelling Earbuds'; price = 199.99; }
        else if (productId === 203) { name = 'Nova Z Smartphone'; price = 799.00; }
        else if (productId === 204) { name = 'Fast Charging USB Hub'; price = 49.50; }
        else if (productId === 205) { name = 'Studio Reference Speakers'; price = 350.00; }
        else { name = `Product ${productId}`; price = 99.99; } // Default placeholder
        
        const newItem = { id: productId, name: name, price: price, quantity: quantity };
        cart.push(newItem);
    }
    
    saveCart();
    updateCartCount();
    console.log(`Added Product ${productId}. Current Cart:`, cart);
}



function calculateCartTotals() {
    const shippingCost = 15.00; 
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const total = subtotal + shippingCost;

    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}


function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return; 

    container.innerHTML = ''; 

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 50px;">Your cart is empty. <a href="products.html">Start shopping!</a></p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const itemHtml = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        

[Image of item ID ${item.id}]

                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p style="font-size: 0.9em;">Price: $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-quantity">
                        <input type="number" value="${item.quantity}" min="1" 
                               onchange="updateCartItem(${item.id}, this.value)">
                    </div>
                    <div class="item-total">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeItemFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            container.innerHTML += itemHtml;
        });
    }

    calculateCartTotals();
}

/**
 * Updates the quantity of a specific item in the cart.
 * @param {number} productId 
 * @param {number} newQuantity 
 */
function updateCartItem(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    
    if (quantity < 1) return; 

    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity = quantity;
        saveCart();
        updateCartCount();
        renderCart(); 
    }
}

/**
 * Removes a specific item from the cart.
 * @param {number} productId 
 */
function removeItemFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    saveCart();
    updateCartCount();
    renderCart();
}
function filterProducts() {
    const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
    const maxPriceInput = document.getElementById('price-max');
    const maxPrice = maxPriceInput ? parseFloat(maxPriceInput.value) : Infinity;
    
   
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);

    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return; 

    const products = productGrid.querySelectorAll('.product-card');

    products.forEach(card => {
        const productCategory = card.getAttribute('data-category');
        const productName = card.getAttribute('data-name').toLowerCase();
        const productPrice = parseFloat(card.getAttribute('data-price'));

        let categoryMatch = (selectedCategories.length === 0) || selectedCategories.includes(productCategory);
        let priceMatch = productPrice <= maxPrice;
        let searchMatch = productName.includes(searchTerm);


        if (categoryMatch && priceMatch && searchMatch) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}


function resetFilters() {
    
    const searchInput = document.getElementById('product-search');
    if (searchInput) searchInput.value = '';


    document.querySelectorAll('input[name="category"]:checked').forEach(cb => {
        cb.checked = false;
    });


    const priceMaxInput = document.getElementById('price-max');
    if (priceMaxInput) {
        priceMaxInput.value = 500;
        document.getElementById('price-value').textContent = 500;
    }

    filterProducts();
}




/**
 * Handles client-side form validation for Login, Signup, and Payment forms.
 * @param {Event} event 
 * @param {string} formType 
 */
function validateForm(event, formType) {
    const form = event.target;
    let isValid = true;
    let errorMessages = [];

    form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            errorMessages.push(`The field "${input.name || input.id}" is required.`);
            input.style.border = '1px solid red'; 
        } else {
            input.style.border = ''; 
        }
    });

    
    const emailInput = form.querySelector('input[type="email"]');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailPattern.test(emailInput.value) && emailInput.value.trim() !== '') {
        isValid = false;
        errorMessages.push('Please enter a valid email address.');
        emailInput.style.border = '1px solid red';
    }

    
    if (formType === 'payment') {
        const ccInput = form.querySelector('#cc-number');

        if (ccInput && (ccInput.value.length < 13 || ccInput.value.length > 19 || isNaN(ccInput.value.replace(/\s/g, '')))) {
            isValid = false;
            errorMessages.push('Please enter a valid credit card number.');
            ccInput.style.border = '1px solid red';
        }
    }

    if (!isValid) {
        event.preventDefault();
        alert(`Form Errors:\n${errorMessages.join('\n')}`);
    }
    

    if (formType === 'payment' && isValid) {

        setTimeout(() => {
            window.location.href = 'confirmation.html';
        }, 500);
        event.preventDefault();
    }
}

/**
 * Handles the submission of the feedback form to the SheetDB API.
 * This is the Bonus Challenge implementation.
 * @param {Event} event 
 */
function handleFeedbackSubmission(event) {
    event.preventDefault(); 

    const form = event.target;
    const messageElement = document.getElementById('feedback-message');
    const formData = new FormData(form);
    

    const formObject = {};
    formData.forEach((value, key) => {

        const match = key.match(/data\[(.*?)\]/);
        if (match && value) {
            formObject[match[1]] = value;
        }
    });

    messageElement.textContent = 'Submitting...';


    if (SHEETDB_API_URL === 'YOUR_SHEETDB_API_ENDPOINT_URL_HERE') {
        messageElement.textContent = 'Feedback simulated: Success! (Update SHEETDB_API_URL in script.js)';
        form.reset();
        return;
    }

    fetch(SHEETDB_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: formObject })
    })
    .then(response => response.json())
    .then(data => {
        console.log('SheetDB Success:', data);
        messageElement.textContent = 'Thank you! Your feedback has been recorded.';
        form.reset(); 
    })
    .catch(error => {
        console.error('SheetDB Error:', error);
        messageElement.textContent = 'Error submitting feedback. Check console or API URL.';
    });
}

document.addEventListener('DOMContentLoaded', () => {

    updateCartCount();
    const addToCartButton = document.getElementById('add-to-cart-btn');
    if (addToCartButton) {
        
        addToCartButton.addEventListener('click', () => {
             const quantity = parseInt(document.getElementById('quantity')?.value || 1);
             addToCart(203, quantity);
        });
    }

    document.getElementById('login-form')?.addEventListener('submit', (e) => validateForm(e, 'login'));
    document.getElementById('signup-form')?.addEventListener('submit', (e) => validateForm(e, 'signup'));
    document.getElementById('payment-form')?.addEventListener('submit', (e) => validateForm(e, 'payment'));
    document.getElementById('feedback-form')?.addEventListener('submit', handleFeedbackSubmission);
    if (document.getElementById('product-grid')) {
        filterProducts();
    }
    
    if (document.getElementById('cart-items-container')) {
 
        if (cart.length === 0) {
            addToCart(101, 2); 
            addToCart(203, 1);
            saveCart(); 
        }
        renderCart();
    }
});