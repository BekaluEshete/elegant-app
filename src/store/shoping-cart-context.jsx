import React, { createContext, useReducer } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products.js';

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (item) => item.id === action.id
      );
      const existingItem = updatedItems[existingCartItemIndex];

      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === action.id);
        updatedItems.push({
          id: product.id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return { items: updatedItems };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = [...state.items];
      const itemIndex = updatedItems.findIndex(item => item.id === action.id);
      const item = updatedItems[itemIndex];

      if (!item) return state;

      const updatedItem = {
        ...item,
        quantity: item.quantity + action.amount,
      };

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(itemIndex, 1); // Remove item
      } else {
        updatedItems[itemIndex] = updatedItem;
      }

      return { items: updatedItems };
    }

    default:
      return state;
  }
}

export default function CartContextProvider({ children }) {
  const [shoppingCartState, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  function handleAddItemToCart(id) {
    dispatch({ type: 'ADD_ITEM', id });
  }

  function handleUpdateCartItemQuantity(id, amount) {
    dispatch({ type: 'UPDATE_QUANTITY', id, amount });
  }

  const contextValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}
