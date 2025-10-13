import jwt from "jsonwebtoken";

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.accessToken;

//     if (!token) {
//       return res.status(401).json({
//         message: "User not authenticated",
//         success: false,
//       });
//     }

//     const decoded = jwt.verify(token, process.env.SECRET_KEY);

//     if (!decoded) {
//       return res.status(401).json({
//         message: "Invalid token",
//         success: false,
//       });
//     }

//     req.id = decoded.id;
//     next();

//   } catch (error) {
//     console.log("Auth Error:", error);
//     return res.status(401).json({
//       message: "Authentication failed",
//       success: false,
//     });
//   }
// };

// export default isAuthenticated;





const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw new Error("No access token");

    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    req.id = decoded.id;
    return next();

  } catch (accessError) {
    console.log("Access token expired or invalid:", accessError.message);

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Session Expired, Please Login again", success: false });
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.SECRET_KEY);

      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id },
        process.env.SECRET_KEY,
        { expiresIn: "15m" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      req.id = decodedRefresh.id;
      return next();

    } catch (refreshError) {
      console.log("Refresh token invalid:", refreshError.message);
      return res.status(401).json({ message: "Session Expired, Please Login again", success: false });
    }
  }
};

export default isAuthenticated;
