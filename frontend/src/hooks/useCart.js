import { useState, useMemo } from 'react';

export function useCart() {
  const [cart, setCart] = useState([]);
  
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product_id === product.id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { 
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        tax: Number(product.tax || 5.0),
        quantity: 1
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product_id === productId) {
          const newQ = item.quantity + delta;
          if (newQ <= 0) return item; // Don't allow 0, use removeFromCart instead
          return { ...item, quantity: newQ };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const setCartFromOrder = (orderItems) => {
    // Map existing order_items schema to cart schema
    const mappedItems = orderItems.map(item => ({
      product_id: item.product_id,
      name: item.product_name,
      price: Number(item.unit_price),
      tax: Number(item.tax),
      quantity: Number(item.quantity)
    }))
    setCart(mappedItems)
  }

  // Derived state for totals
  const totals = useMemo(() => {
    let subtotal = 0;
    let taxTotal = 0;

    cart.forEach(item => {
      const itemSub = item.price * item.quantity;
      const itemTax = itemSub * (item.tax / 100);
      subtotal += itemSub;
      taxTotal += itemTax;
    });

    return {
      subtotal: subtotal.toFixed(2),
      taxTotal: taxTotal.toFixed(2),
      total: (subtotal + taxTotal).toFixed(2),
      itemCount: cart.reduce((acc, item) => acc + item.quantity, 0)
    };
  }, [cart]);

  return {
    cart,
    totals,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCartFromOrder
  };
}
