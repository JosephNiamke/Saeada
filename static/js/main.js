// Gestion du panier (reste côté client pour l'instant)
class Cart {
  constructor() {
    this.items = this.loadCart()
    this.updateCartCount()
  }

  loadCart() {
    const saved = localStorage.getItem("saeada_cart")
    return saved ? JSON.parse(saved) : []
  }

  saveCart() {
    localStorage.setItem("saeada_cart", JSON.stringify(this.items))
    this.updateCartCount()
  }

  // Modifié pour accepter les détails du produit directement
  addItem(productId, productName, productPrice, productImage, quantity = 1) {
    const existingItem = this.items.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.items.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity,
      })
    }

    this.saveCart()
    this.showNotification(`${productName} ajouté au panier!`)
    return true
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId)
    this.saveCart()
    this.displayCart() // Re-render cart after removal
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = quantity
        this.saveCart()
      }
    }
    this.displayCart() // Re-render cart after quantity update
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  }

  updateCartCount() {
    const cartCounts = document.querySelectorAll(".cart-count")
    const count = this.getTotalItems()
    cartCounts.forEach((element) => {
      element.textContent = count
      element.style.display = count > 0 ? "inline-block" : "none"
    })
  }

  showNotification(message) {
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  clear() {
    this.items = []
    this.saveCart()
    this.displayCart() // Re-render cart after clearing
  }

  // Fonction pour afficher le contenu du panier sur la page panier.html
  displayCart() {
    const cartContent = document.getElementById("cart-content")
    const cartEmpty = document.getElementById("cart-empty")

    if (!cartContent || !cartEmpty) return // Ensure elements exist

    if (this.items.length === 0) {
      cartContent.style.display = "none"
      cartEmpty.style.display = "block"
      return
    }

    cartContent.style.display = "block"
    cartEmpty.style.display = "none"

    const cartItemsHtml = this.items
      .map(
        (item) => `
        <div class="cart-item mb-3">
          <div class="row align-items-center">
            <div class="col-md-2">
              <div class="bg-light rounded p-2 text-center">
                <img src="${item.image}" alt="${item.name}" class="img-fluid" style="max-height: 80px;">
              </div>
            </div>
            <div class="col-md-4">
              <h5 class="mb-1">${item.name}</h5>
              <p class="text-muted mb-0">Prix unitaire: ${formatPrice(item.price)}</p>
            </div>
            <div class="col-md-2">
              <div class="product-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
            <div class="col-md-3">
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="mx-2 fw-bold">${item.quantity}</span>
                <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
              </div>
            </div>
            <div class="col-md-1">
              <button onclick="cart.removeItem(${item.id})" class="btn btn-danger btn-sm">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `,
      )
      .join("")

    cartContent.innerHTML = `
      <div class="row">
        <div class="col-lg-8">
          ${cartItemsHtml}
        </div>
        <div class="col-lg-4">
          <div class="cart-summary">
            <div class="cart-total d-flex justify-content-between align-items-center mb-4">
              <span>Total:</span>
              <span class="total-amount">${formatPrice(this.getTotal())}</span>
            </div>
            <button onclick="cart.orderViaWhatsApp()" class="btn btn-whatsapp w-100 mb-3">
              <i class="fab fa-whatsapp"></i> Commander via WhatsApp
            </button>
            <button onclick="cart.clear()" class="btn btn-custom-outline w-100">
              <i class="fas fa-trash"></i> Vider le Panier
            </button>
          </div>
        </div>
      </div>
    `
  }

  orderViaWhatsApp() {
    if (this.items.length === 0) {
      alert("Votre panier est vide !")
      return
    }

    let message = "🛍️ *Nouvelle Commande SAEADA STORE*\n\n"
    message += "Bonjour ! Je souhaite commander les produits suivants :\n\n"

    this.items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   • Quantité: ${item.quantity}\n`
      message += `   • Prix unitaire: ${formatPrice(item.price)}\n`
      message += `   • Sous-total: ${formatPrice(item.price * item.quantity)}\n\n`
    })

    message += `💰 *TOTAL: ${formatPrice(this.getTotal())}*\n\n`
    message += "Merci de me confirmer la disponibilité et les modalités de livraison. 🚚"

    const phoneNumber = "2250788635834"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, "_blank")
  }
}

// Instance globale du panier
const cart = new Cart()

// Fonctions utilitaires
function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

// Initialisation des éléments UI qui ne dépendent pas des données produits
function initUIElements() {
  // Initialisation des dropdowns Bootstrap
  const dropdownElementList = [].slice.call(document.querySelectorAll(".dropdown-toggle"))
  dropdownElementList.map((dropdownToggleEl) => new window.bootstrap.Dropdown(dropdownToggleEl))

  // Gestion du panier sur la page panier.html
  if (window.location.pathname.includes("panier.html")) {
    cart.displayCart()
  }
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  cart.updateCartCount() // Update cart count on all pages
  initUIElements() // Initialize Bootstrap dropdowns and cart page
})

// Styles pour les notifications (déplacé ici pour être sûr qu'il est appliqué)
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .notification {
    animation: slideIn 0.3s ease;
  }
`
document.head.appendChild(notificationStyles)
