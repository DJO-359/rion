"use client";



import { motion } from "framer-motion";

import { Shield, Truck, Award, Headphones, Warehouse, Users } from "lucide-react";

import { Container } from "@/components/layout/container";



const BENEFITS = [

  {

    icon: Truck,

    title: "Быстрая и удобная доставка",

    text: "Доставляем по Северному Кавказу от 1 дня",

  },

  {

    icon: Shield,

    title: "Только оригинальная продукция",

    text: "Работаем с официальными поставщиками",

  },

  {

    icon: Warehouse,

    title: "Свой склад",

    text: "Большой ассортимент в наличии",

  },

  {

    icon: Award,

    title: "Официальные бренды",

    text: "100+ проверенных производителей",

  },

  {

    icon: Headphones,

    title: "Подбор под ключ",

    text: "Бесплатная консультация менеджера",

  },

  {

    icon: Users,

    title: "Для бизнеса и дома",

    text: "Оптовые и розничные поставки",

  },

];



export function TrustSection() {

  return (

    <section className="py-14 md:py-16">

      <Container>

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          className="mb-10"

        >

          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">

            Наши преимущества

          </h2>

        </motion.div>



        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {BENEFITS.map((item, i) => (

            <motion.div

              key={item.title}

              initial={{ opacity: 0, y: 16 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}

              transition={{ delay: i * 0.06 }}

              className="rounded-[20px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card-hover)]"

            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(37,99,235,0.08)] text-[var(--primary)]">

                <item.icon size={22} strokeWidth={1.75} />

              </div>

              <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>

              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">

                {item.text}

              </p>

            </motion.div>

          ))}

        </div>

      </Container>

    </section>

  );

}

