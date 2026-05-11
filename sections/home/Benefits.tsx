import { Truck, Clock, Shield, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Шоурум и склад",
    desc: "в одном месте",
  },
  {
    icon: Clock,
    title: "Ежедневные поставки",
    desc: "быстрая отгрузка",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    desc: "только проверенные бренды",
  },
  {
    icon: Headphones,
    title: "Поддержка",
    desc: "поможем с выбором",
  },
];

export default function Benefits() {
  return (
    <section className="py-16 bg-zinc-950 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:border-[#d4af37]/30 transition-colors group"
            >
              <div className="w-14 h-14 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/20 transition-colors">
                <item.icon className="w-7 h-7 text-[#d4af37]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
