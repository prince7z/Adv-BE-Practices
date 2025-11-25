"use client";
import { signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignIn() {
    const [providers, setProviders] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    useEffect(() => {
        const fetchProviders = async () => {
            const res :any = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    const handleCredentialsSignIn = async (e:any) => {
        e.preventDefault();
        setError("");
        
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid credentials");
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                
                {/* Credentials Form */}
                <form className="mt-8 space-y-6" onSubmit={handleCredentialsSignIn}>
                    <div>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Sign In
                    </button>
                </form>

                {/* OAuth Providers */}
                <div className="mt-6">
                    {providers && Object.values(providers).map((provider:any) => (
                        provider.id !== "credentials" && (
                            <button
                                key={provider.id}
                                onClick={() => signIn(provider.id, { callbackUrl })}
                                className="w-full mb-2 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700"
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