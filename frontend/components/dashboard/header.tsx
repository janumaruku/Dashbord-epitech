import ProfileMenu from "@/components/dashboard/profileMenu";
import AddWidgetButton from "@/components/dashboard/addWidget";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
      <h1 className="rounded-md px-3 py-2 text-xl font-semibold hover:bg-zinc-700">
        Dashboard
      </h1>
      <div className="mr-2 flex item-center gap-8">
        <AddWidgetButton />
        <ProfileMenu />
      </div>
    </header>
  );
}
