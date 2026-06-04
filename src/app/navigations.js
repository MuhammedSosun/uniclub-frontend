const navigations = [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },

  // 🔥 MY ACCOUNT
  { name: "Hesabım", path: "/my-account", icon: "person" },

  // ✅ GÜNCELLENEN KISIM: Kullanıcılar -> Üyeler
  { name: "Üyeler", path: "/members", icon: "group" },

  {
    name: "Kulüpler",
    icon: "groups",
    children: [
      { name: "Tüm Kulüpler", path: "/clubs", iconText: "K" },
      { name: "Yeni Kulüp", path: "/clubs/upsert", iconText: "Y" }
    ]
  },

  { name: "Etkinlikler", path: "/events", icon: "event" },

  { label: "PAGES", type: "label" },

  {
    name: "Kullanıcı İşlemleri",
    icon: "security",
    children: [
      { name: "Sign in", iconText: "SI", path: "/session/signin" },
      { name: "Sign up", iconText: "SU", path: "/session/signup" },
      { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" }
    ]
  },
  { name: "AI Önerileri", path: "/ai-recommendations", icon: "smart_toy" },
  {
    name: "About",
    icon: "launch",
    path: "/about"
  }
];

export default navigations;
