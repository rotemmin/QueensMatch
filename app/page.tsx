"use client";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Queens Matcher</h1>
      <div>
        <Link href="/auth/login">
          <button>Login</button>
        </Link>
        <Link href="/auth/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
