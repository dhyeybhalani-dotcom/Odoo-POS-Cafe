/**
 * Kitchen Service
 * Handles order logic for KDS (Kitchen Display System).
 */
const kitchenService = {
  STAGES: {
    TO_COOK: 'to_cook',
    PREPARING: 'preparing',
    READY: 'ready'
  },

  getKDSOrders: async (db) => {
    // Logic to fetch orders filtering by kitchen categories and status
    // returns tickets with items
  },

  updateItemStatus: async (db, orderId, productId, status) => {
    // Mark specific item as prepared
  }
};

module.exports = kitchenService;
