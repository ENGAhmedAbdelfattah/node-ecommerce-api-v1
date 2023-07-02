const calcTotalCartPrice = (cart) => {
  let totalCartPrice = 0;
  cart.cartItems.forEach((item) => {
    totalCartPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalCartPrice;
  cart.totalPriceAfterDiscount = undefined;
};

module.exports = calcTotalCartPrice;
