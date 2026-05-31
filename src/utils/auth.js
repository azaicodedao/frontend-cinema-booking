export const isAdminUser = (user) => ( // Kiểm tra xem người dùng là admin không
  user?.role === 'ADMIN'
  || user?.user?.role === 'ADMIN'
  || (Array.isArray(user?.roles) && user.roles.includes('ADMIN'))
  || (Array.isArray(user?.user?.roles) && user.user.roles.includes('ADMIN'))
);
