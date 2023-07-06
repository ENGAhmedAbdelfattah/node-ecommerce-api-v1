const sanitizeUser = (user) => ({
  name: user.name,
  email: user.email,
  _id: user._id,
});

const sanitizeLoggedUser = (user) => ({
  name: user.name,
  email: user.email,
  _id: user._id,
  wishlist: user.wishlist,
  addresses: user.addresses,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

module.exports = { sanitizeUser, sanitizeLoggedUser };
