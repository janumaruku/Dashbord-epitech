import Link from "next/link"
import ProfileMenu from "@/components/dashboard/profileMenu";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
      <Link
        href="/"
        className="rounded-md px-3 py-2 text-xl font-semibold hover:bg-zinc-700"
      >
        My_Dashboard
      </Link>
      <div className="mr-2 flex item-center gap-8">
        <ProfileMenu />
      </div>
    </header>
  );
}
