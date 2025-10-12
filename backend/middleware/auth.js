import dotenv from 'dotenv';
dotenv.config();

export const authenticateAdmin = (req, res, next) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    next();
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export const simpleAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== 'Bearer authenticated') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};
