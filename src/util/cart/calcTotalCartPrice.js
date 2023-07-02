const calcTotalCartPrice = (cart) => {
  let totalCartPrice = 0;
  console.log(cart);
  cart.cartItems.forEach((item) => {
    totalCartPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalCartPrice;
  cart.totalPriceAfterDiscount = undefined;
};

module.exports = calcTotalCartPrice;
