"use strict";
// // src/middleware/auth.ts
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// export const authenticate = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }
//   jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ error: 'Invalid token' });
//     }
//     req.user = decoded;
//     next();
//   });
// };
