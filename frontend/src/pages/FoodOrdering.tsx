import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { addToCart, removeFromCart, clearCart } from '../store/slices/ordersSlice';
import styles from './FoodOrdering.module.css';

const mockMenu = [
  { id: '1', category: 'Burgers', name: 'Classic Cheeseburger', price: 12.99, prepTime: 15 },
  { id: '2', category: 'Burgers', name: 'BBQ Bacon Burger', price: 15.99, prepTime: 18 },
  { id: '3', category: 'Pizza', name: 'Pepperoni Slice', price: 8.99, prepTime: 12 },
  { id: '4', category: 'Pizza', name: 'Margherita Slice', price: 7.99, prepTime: 12 },
  { id: '5', category: 'Drinks', name: 'Soft Drink', price: 3.99, prepTime: 2 },
  { id: '6', category: 'Drinks', name: 'Craft Beer', price: 8.99, prepTime: 2 },
  { id: '7', category: 'Snacks', name: 'Loaded Fries', price: 6.99, prepTime: 10 },
  { id: '8', category: 'Snacks', name: 'Nachos Supreme', price: 9.99, prepTime: 12 },
];

const categories = ['All', ...Array.from(new Set(mockMenu.map(item => item.category)))];

const FoodOrdering = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const { cart } = useAppSelector(state => state.orders);
  const { seatInfo } = useAppSelector(state => state.user);

  const filteredMenu = selectedCategory === 'All' 
    ? mockMenu 
    : mockMenu.filter(item => item.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (item: typeof mockMenu[0]) => {
    dispatch(addToCart({
      menuItemId: item.id,
      name: item.name,
      quantity: 1,
      price: item.price
    }));
  };

  const handleRemoveFromCart = (menuItemId: string) => {
    dispatch(removeFromCart(menuItemId));
  };

  const handleCheckout = async () => {
    dispatch(clearCart());
    alert('Order placed successfully! Track it in notifications.');
    navigate('/map');
  };

  return (
    <div className={styles.ordering}>
      <div className={styles.header}>
        <h2>Order Food</h2>
        <button 
          className={styles.cartBtn}
          onClick={() => setShowCart(!showCart)}
        >
          🛒 {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </button>
      </div>

      <div className={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.menu}>
        {filteredMenu.map(item => (
          <div key={item.id} className={styles.menuItem}>
            <div className={styles.itemInfo}>
              <h3>{item.name}</h3>
              <p className={styles.prepTime}>⏱️ {item.prepTime} min</p>
            </div>
            <div className={styles.itemActions}>
              <span className={styles.price}>${item.price.toFixed(2)}</span>
              <button 
                className={styles.addBtn}
                onClick={() => handleAddToCart(item)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <div className={styles.cartOverlay}>
          <div className={styles.cart}>
            <div className={styles.cartHeader}>
              <h3>Your Cart</h3>
              <button onClick={() => setShowCart(false)}>×</button>
            </div>

            {cart.length === 0 ? (
              <p className={styles.emptyCart}>Your cart is empty</p>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {cart.map(item => (
                    <div key={item.menuItemId} className={styles.cartItem}>
                      <div className={styles.cartItemInfo}>
                        <h4>{item.name}</h4>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className={styles.cartItemActions}>
                        <span>×{item.quantity}</span>
                        <button onClick={() => handleRemoveFromCart(item.menuItemId)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.cartTotal}>
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <div className={styles.deliveryOption}>
                  <label>Delivery to:</label>
                  <select defaultValue={seatInfo ? 'seat' : 'pickup'}>
                    <option value="seat">Seat ({seatInfo?.section}-{seatInfo?.row}-{seatInfo?.seat})</option>
                    <option value="pickup">Pickup</option>
                  </select>
                </div>

                <button className={styles.checkoutBtn} onClick={handleCheckout}>
                  Checkout with Google Pay
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodOrdering;
