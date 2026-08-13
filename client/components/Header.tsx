import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-end gap-2">
      <Link href="/">Main</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <Link href="/dashboard">Dashboard</Link>
    </header>
  );
}
