import { loginUser, registerUser, logoutUser } from "../apis/authAPIs";
import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { FiHeadphones, FiMic, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "listener", label: "Listener", Icon: FiHeadphones },
  { value: "artist", label: "Artist", Icon: FiMic },
];

const fieldClass =
  "h-12 w-full rounded-lg border border-[#1f2a3f] bg-[#0c1220] px-4 text-[15px] text-white " +
  "shadow-inner shadow-black/30 placeholder:text-[#5d6b82] outline-none transition " +
  "focus:border-[#42e68b] focus:ring-2 focus:ring-[#42e68b]/25";

const labelClass = "mb-2 block text-[13px] font-medium text-[#c3ccdb]";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [role, setRole] = useState("listener");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // already logged in? go straight to the right page (runs once, when this page opens)
  useEffect(() => {
    if (user)
      navigate(user.role === "artist" ? "/artist" : "/", { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isRegister = mode === "register";
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const picked = role === "artist" ? "artist" : "user"; // use the role names your User model accepts
      const email = form.email.trim();

      let data;
      if (isRegister) {
        await registerUser({
          username: form.username.trim(),
          email,
          password: form.password,
          role: picked,
        });
        // many backends do NOT start a session on register, so log in right away
        data = await loginUser({ email, password: form.password });
      } else {
        data = await loginUser({ email, password: form.password });
      }

      // save the logged-in user
      const u = data.user || data;
      const token = data.token || data.accessToken || data.jwt;
      if (token) localStorage.setItem("token", token);
      const accountRole =
        (u.role || (isRegister ? picked : "user")) === "artist"
          ? "artist"
          : "user";

      // a listener account cannot use the Artist card
      if (role === "artist" && accountRole !== "artist") {
        try {
          await logoutUser();
        } catch {
          /* ignore */
        }
        localStorage.removeItem("token");
        throw new Error(
          "This is a listener account, so it can't log in as an Artist. Choose Listener.",
        );
      }

      login({
        id: u._id || u.id,
        username: u.username || form.username.trim(),
        email: u.email || email,
        role: accountRole,
      });

      // artist + Artist card -> dashboard.  Everyone else (or artist + Listener card) -> Home
      navigate(accountRole === "artist" && role === "artist" ? "/artist" : "/");
    } catch (err) {
      setError(err.message || "Can't reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#050810] p-3 sm:p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-[#243049] bg-[#070a11] shadow-2xl shadow-black/60 md:grid-cols-2">
        {/* ============ Left: brand ============ */}
        <section
          className="relative flex items-center justify-center px-6 py-7 sm:py-9 md:min-h-[620px] md:py-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/left-login-bg.jpg')` }}
        >
          {/* Dark overlay taaki background thoda dark rahe aur logo/text prominent dikhe */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex flex-row items-center gap-4 md:flex-col md:gap-3 md:text-center">
            <FaSpotify className="h-14 w-14 shrink-0 text-[#42e68b] sm:h-16 sm:w-16 md:h-[88px] md:w-[88px]" />
            <div>
              <h1 className="text-xl font-semibold text-white sm:text-2xl md:text-[28px]">
                Spotify
              </h1>
              <p className="text-sm text-[#d3dae6] md:text-[15px]">
                Music for everyone
              </p>
            </div>
          </div>
        </section>

        {/* ============ Right: form ============ */}
        <section className="flex flex-col justify-center border-t border-[#1b2638] px-5 py-8 sm:px-8 md:border-l md:border-t-0 md:px-8 md:py-12 lg:px-12">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="text-2xl font-bold text-white sm:text-[26px]">
              {isRegister ? "Create Account" : "Welcome Back!"}
            </h2>
            <p className="mt-1 text-sm text-[#8e9bb0]">
              Choose your role to continue
            </p>

            {/* Role cards */}
            <div
              role="radiogroup"
              aria-label="Account type"
              className="mt-5 grid grid-cols-2 gap-3"
            >
              {ROLES.map(({ value, label, Icon }) => {
                const selected = role === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setRole(value)}
                    className={
                      "flex h-[86px] flex-col items-center justify-center gap-2 rounded-xl border text-sm font-medium transition " +
                      (selected
                        ? "border-[#3be3b0] bg-gradient-to-b from-[#040e0e] to-[#031011] text-[#4ee8c0] shadow-[0_0_0_1px_rgba(59,227,176,0.25),0_0_22px_rgba(59,227,176,0.22)]"
                        : "border-[#1f2a3f] bg-[#0c1220] text-[#d3dae6] hover:border-[#3a4863]")
                    }
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Login / Register tabs */}
            <div
              role="tablist"
              aria-label="Login or register"
              className="mt-6 grid grid-cols-2 border-b border-[#1b2638] text-[15px]"
            >
              {[
                ["login", "Login"],
                ["register", "Register"],
              ].map(([value, label]) => {
                const active = mode === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => switchMode(value)}
                    className={
                      "relative py-3 font-medium transition " +
                      (active
                        ? "text-white after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-[#42e6a0]"
                        : "text-[#aab5c8] hover:text-white")
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {isRegister && (
                <div>
                  <label htmlFor="username" className={labelClass}>
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="username"
                    placeholder="Your name"
                    value={form.username}
                    onChange={onChange}
                    className={fieldClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={isRegister ? 6 : undefined}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    placeholder={
                      isRegister
                        ? "At least 6 characters"
                        : "Enter your password"
                    }
                    value={form.password}
                    onChange={onChange}
                    className={fieldClass + " pr-12"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#c3ccdb] transition hover:text-white"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <FiEye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-lg bg-gradient-to-b from-[#55ec95] to-[#3cdc84] text-[15px] font-semibold text-[#04120a] shadow-lg shadow-[#42e68b]/20 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
              >
                {loading
                  ? isRegister
                    ? "Creating account..."
                    : "Logging in..."
                  : isRegister
                    ? "Create Account"
                    : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] text-[#c3ccdb]">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(isRegister ? "login" : "register")}
                className="font-medium text-[#38d5ee] hover:underline"
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
