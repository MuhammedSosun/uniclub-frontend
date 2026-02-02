import { createContext, useEffect, useReducer } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Loading from "app/components/MatxLoading";

// 🌐 API BASE URL (backend)
axios.defaults.baseURL = "http://localhost:8080/api";

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

// 🔹 Token doğrulama
const isValidToken = (accessToken) => {
  if (!accessToken) return false;
  try {
    const decoded = jwtDecode(accessToken);
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
  method: "JWT"
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 🔹 LOGIN → kullanıcı numarasıyla giriş
  // 🔹 LOGIN → kullanıcı numarasıyla giriş
  const login = async (username, password) => {
    try {
      const response = await axios.post("/auth/authenticate", { username, password });

      // 🔥 DEBUG: Backend'den gelen ham veriyi görelim
      console.log("🛑 [DEBUG] Backend Login Yanıtı:", response.data);

      const data = response.data;

      // Token'ları al (Farklı isimlendirmeleri kontrol ediyoruz)
      const accessToken = data.accessToken || data.payload?.accessToken || data.token;
      const refreshToken = data.refreshToken || data.payload?.refreshToken;

      // User bilgisini bulmaya çalışıyoruz
      // 1. İhtimal: data.payload içinde user objesi var mı?
      // 2. İhtimal: data.user var mı?
      // 3. İhtimal: data.payload'ın kendisi user mı?
      let userData = data.payload?.user || data.user || data.payload || {};

      // Eğer payload içinde accessToken varsa ve payload'ın geri kalanı user ise:
      if (data.payload && data.payload.accessToken) {
        // Token payload içindeyse, user bilgileri muhtemelen aynı seviyededir veya ayrıdır.
        // Genelde şu yapıda olabilir: { payload: { accessToken: "...", id: 123, username: "..." } }
        userData = data.payload;
      }

      console.log("🛑 [DEBUG] Tespit Edilen User Data:", userData);

      const user = {
        id: userData.id || userData.userId, // ID burada mı?
        username: userData.username || username,
        email: userData.email,
        role: userData.role
      };

      if (accessToken) {
        setSession(accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        // 🔥 ID KAYDETME (Çoklu kontrol)
        if (user.id) {
          localStorage.setItem("userId", user.id);
          console.log("✅ LOGIN BAŞARILI: User ID kaydedildi:", user.id);
        } else {
          console.error(
            "❌ LOGIN UYARISI: User ID bulunamadı! Lütfen yukarıdaki [DEBUG] çıktılarına bak."
          );
        }

        dispatch({ type: "LOGIN", payload: { user } });
      }
    } catch (error) {
      console.error("Login Hatası:", error);
      throw error; // Hatayı fırlat ki Login sayfası yakalasın
    }
  };

  // 🔹 REGISTER → e-posta ile kayıt
  const register = async (email, password) => {
    const { data } = await axios.post("/auth/register", { email, password });

    const accessToken = data.accessToken || data.payload?.accessToken;
    const refreshToken = data.refreshToken || data.payload?.refreshToken;

    // Register sonrası ID dönüyorsa onu da kaydetmeliyiz
    const payloadUser = data.payload || {};
    const username = email.split("@")[0];
    const user = { username, email, id: payloadUser.id };

    if (accessToken) {
      setSession(accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (payloadUser.id) {
        localStorage.setItem("userId", payloadUser.id);
      }

      dispatch({ type: "REGISTER", payload: { user } });
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    setSession(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId"); // Çıkış yapınca ID'yi de silelim
    dispatch({ type: "LOGOUT" });
  };

  // 🔹 İlk açılışta token kontrolü
  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const decoded = jwtDecode(accessToken);

          // Sayfa yenilendiğinde userId local storage'da varsa onu kullanmaya devam edelim
          const storedUserId = localStorage.getItem("userId");

          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: true,
              user: {
                id: storedUserId, // State'e de geri yükleyelim
                username: decoded.sub
              }
            }
          });
        } else {
          dispatch({
            type: "INIT",
            payload: { isAuthenticated: false, user: null }
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: false, user: null }
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
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
