"use client";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Queens Matcher</h1>
      <div>
        <Link href="/login">
          <button>Login</button>
        </Link>
        <Link href="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
