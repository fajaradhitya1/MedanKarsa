import {
  CalendarDays,
  Compass,
  MapPin,
  Store,
  CircleAlert,
  Ticket,
  Wallet,
  User,
} from "lucide-react";

const menus = [
  {
    icon: Compass,
    label: "Destinasi",
    href: "/heritage",
  },
  {
    icon: CalendarDays,
    label: "Event",
    href: "/event",
  },
  {
    icon: Store,
    label: "UMKM",
    href: "/umkm",
  },
  {
    icon: Ticket,
    label: "Tiket",
    href: "/event",
  },
  {
    icon: Wallet,
    label: "Karsa",
    href: "/wallet",
  },
  {
    icon: User,
    label: "Akun",
    href: "/account",
  },
];

export default function QuickMenu() {
  return (
    <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 " >
      {menus.map((menu, index) => {
        const Icon = menu.icon;

        return (
          <a
            key={menu.label}
            href={menu.href}
            className="group flex items-center gap-3 rounded-2xl border border-[#e8dfcf] bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                index % 2 === 0
                  ? "bg-[#e3eee4] text-[#21633f]"
                  : "bg-[#f7e8c9] text-[#ad7520]"
              }`}
            >
              <Icon size={19} />
            </div>

            <span className="text-xs font-semibold text-[#374039]">
              {menu.label}
            </span>
          </a>
        );
      })}
    </section>
  );
}