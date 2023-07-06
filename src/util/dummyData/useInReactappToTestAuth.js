// import axios from "axios";

// function getCookie(cname) {
//   let name = cname + "=";
//   let decodedCookie = decodeURIComponent(document.cookie);
//   let ca = decodedCookie.split(";");
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) == " ") {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }

// const handleClick = async () => {
//   const login = await axios.post(
//     "http://localhost:7000/api/v1/auth/login",
//     {
//       email: "reactmeOO4@gmail.com",
//       password: "MohamedSalah@123",
//     },
//     { withCredentials: true }
//   );
//   console.log("login:", login);
//   // const responseToken = await axios.get(
//   //   "http://localhost:7000/api/v1/auth/csrftoken",
//   //   { withCredentials: true }
//   // );
//   const responseToken = getCookie("X-CSRF-TOKEN");
//   console.log("responseToken:", responseToken);
//   const token = responseToken.data.token;
//   console.log("token:", token);
//   const response = await axios.post(
//     "http://localhost:7000/api/v1/cart/",
//     {
//       productId: "6484eba6820d914df3e99286",
//       quantity: 1,
//       color: "red",
//       token,
//     },
//     { withCredentials: true }
//   );
//   console.log(response);
// };
