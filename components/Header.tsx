import Logo from './Logo';

export default function Header() {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center max-w-4xl mx-auto">
      <Logo />
      <a href="/about" className="text-gray-600 hover:text-primary text-sm">
        About
      </a>
    </header>
  );
}
