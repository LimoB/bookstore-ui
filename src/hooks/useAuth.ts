export const useAuth = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return {
    token,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token,
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  };
};
