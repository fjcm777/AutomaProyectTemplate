import { useState } from "react";

type User = {
    username: string
    password: string
}

export function LoginPage(){
    const [user, setUser] = useState<User | null>(null)

    function login() {
        setUser({
            username: "test",
            password: "test"
        })

        alert(user?.username)
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <form className="max-w-sm mx-auto">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        className="w-full rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Username"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="w-full rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Password"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={login}
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    )
}
