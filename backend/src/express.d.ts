import { User } from './user.model'; // Import your user model

// You can also use a simple interface if your user object is simple
// interface UserPayload {
//   userId: number;
//   email: string;
// }

declare global {
  namespace Express {
    interface User {
      username?: string;
    }
  }
}
