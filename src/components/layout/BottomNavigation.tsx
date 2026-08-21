import {
  Compass,
  Home,
  Ticket,
  User,
  Wallet,
} from "lucide-react";

const items = [
  {
    icon: Home,
    label: "Beranda",
    href: "/dashboard",
  },
  {
    icon: Compass,
    label: "Jelajah",
    href: "/heritage",
  },
  {
    icon: Ticket,
    label: "Tiket",
    href: "/event",
  },
  {
    icon: Wallet,
    label: "Dompet",
    href: "/wallet",
  },
  {
    icon: User,
    label: "Akun",
    href: "/account",
  },
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e3dbcc] bg-[#fffdf8]/95 px-3 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex min-w-[55px] flex-col items-center gap-1 text-[10px] font-semibold ${
                index === 0
                  ? "text-[#21633f]"
                  : "text-[#858b84]"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}