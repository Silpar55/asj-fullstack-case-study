export default function Login() {
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center">
      <form className="flex flex-col gap-5 w-80">
        <h1 className="text-white text-4xl  text-center uppercase">
          Welcome Back!
        </h1>

        <div className="flex gap-2 border border-white p-2 ">
          <img src="user.svg" alt="user" className="text-sm" />
          <input
            type="text"
            placeholder="username"
            className="w-full bg-transparent placeholder:uppercase placeholder:text-white placeholder:text-sm text-white focus:outline-none"
          />
        </div>

        <div className="flex gap-2 border border-white p-2 ">
          <img src="lock.svg" alt="user" className="text-sm" />
          <input
            type="password"
            placeholder="password"
            className="w-full bg-transparent placeholder:uppercase placeholder:text-white placeholder:text-sm text-white focus:outline-none"
          />
        </div>

        <div className="w-full">
          <button className="border rounded p-2 w-full bg-white uppercase text-blue-600 font-semibold">
            Login
          </button>
          <p className="text-white font-medium text-right mt-1">
            Forgot password?
          </p>
        </div>
      </form>
    </main>
  );
}
