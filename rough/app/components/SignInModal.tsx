"use client";
import { signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [providers, setProviders] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      const res:any = await getProviders();
      setProviders(res);
    };
    if (isOpen) fetchProviders();
  }, [isOpen]);

  const handleCredentialsSignIn = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);
    
    if (result?.error) {
      setError("Invalid credentials");
    } else {
      onClose(); // Close modal on success
      window.location.reload(); // Refresh to update session
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* OAuth Providers */}
        <div className="mt-4 space-y-2">
          {providers && Object.values(providers).map((provider: any) => (
            provider.id !== "credentials" && (
              <button
                key={provider.id}
                onClick={() => signIn(provider.id)}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Sign in with {provider.name}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
}