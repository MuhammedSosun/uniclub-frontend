import { createContext, useEffect, useReducer } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Loading from "app/components/MatxLoading";

// 🌐 API BASE URL (backend)
axios.defaults.baseURL = "http://localhost:8080/api";

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

// 🔹 Token doğrulama
const isValidToken = (accessToken) => {
  if (!accessToken) return false;
  try {
    const decoded = jwtDecode(accessToken);
    // Eğer token içinde exp varsa süresi dolmamış mı kontrol et
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) return false;
    return true;
  } catch {
    return false;
  }
};

// 🔹 Token’ı localStorage ve axios header’a koyar
const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, user, isAuthenticated, isInitialized: true };
    }
    case "LOGIN": {
      const { user } = action.payload;
      return { ...state, user, isAuthenticated: true };
    }
    case "LOGOUT": {
      return { ...state, user: null, isAuthenticated: false };
    }
    case "REGISTER": {
      const { user } = action.payload;
      return { ...state, user, isAuthenticated: true };
    }
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 🔹 LOGIN → kullanıcı numarasıyla giriş
  const login = async (username, password) => {
    const { data } = await axios.post("/auth/authenticate", { username, password });

    const accessToken = data.accessToken || data.payload?.accessToken;
    const refreshToken = data.refreshToken || data.payload?.refreshToken;
    const user = data.payload
      ? {
          username: data.payload.username,
          email: data.payload.email,
          role: data.payload.role,
        }
      : {};

    if (accessToken) {
      setSession(accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      dispatch({ type: "LOGIN", payload: { user } });
    }
  };

  // 🔹 REGISTER → e-posta ile kayıt
  const register = async (email, password) => {
    const { data } = await axios.post("/auth/register", { email, password });

    const accessToken = data.accessToken || data.payload?.accessToken;
    const refreshToken = data.refreshToken || data.payload?.refreshToken;
    const username = email.split("@")[0]; // 210101068@ogrenci.yalova.edu.tr → 210101068
    const user = { username, email };

    if (accessToken) {
      setSession(accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      dispatch({ type: "REGISTER", payload: { user } });
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    setSession(null);
    localStorage.removeItem("refreshToken");
    dispatch({ type: "LOGOUT" });
  };

  // 🔹 İlk açılışta token kontrolü
  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          // backend’de /auth/profile yoksa bu kısım fake kullanıcıyı set eder
          const decoded = jwtDecode(accessToken);
          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: true,
              user: {
                username: decoded.sub, // token içinde sub alanı varsa
              },
            },
          });
        } else {
          dispatch({
            type: "INIT",
            payload: { isAuthenticated: false, user: null },
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: false, user: null },
        });
      }
    })();
  }, []);

  if (!state.isInitialized) return <Loading />;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
