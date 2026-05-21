import { createContext } from 'react';

/**
 * Context để điều khiển AuthModal từ bất kỳ đâu trong ứng dụng.
 * Cho phép PrivateRoute, MovieDetails, v.v. mở Modal mà không cần truyền props qua nhiều tầng.
 */
const AuthModalContext = createContext({
    openLogin: () => {},
    openRegister: () => {},
});

export default AuthModalContext;
