"use client";



import { motion } from "framer-motion";

import { Star } from "lucide-react";

import { Container } from "@/components/layout/container";



const REVIEWS = [

  {

    name: "Аслан М.",

    city: "Нальчик",

    product: "Плитка Kerama Marazzi",

    text: "Заказали плитку и смесители для ванной — привезли за 2 дня. Менеджер помог с расчётом количества.",

    rating: 5,

  },

  {

    name: "Марина К.",

    city: "Пятигорск",

    product: "Люстры и светильники",

    text: "Большой выбор освещения, всё в наличии. Консультация бесплатная, подобрали под интерьер.",

    rating: 5,

  },

  {

    name: "Руслан Т.",

    city: "Владикавказ",

    product: "Ламинат Egger",

    text: "Брал ламинат оптом на объект. Цена адекватная, доставили на стройку в срок.",

    rating: 5,

  },

];



export function ReviewsSection() {

  return (

    <section className="border-y border-[var(--border)] bg-[#f8fafc] py-14 md:py-16">

      <Container>

        <div className="mb-10 text-center">

          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">

            Что говорят клиенты

          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {REVIEWS.map((review, i) => (

            <motion.article

              key={review.name}

              initial={{ opacity: 0, y: 20 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}

              transition={{ delay: i * 0.1 }}

              className="flex flex-col rounded-[20px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]"

            >

              <div className="flex gap-1 text-[var(--primary)]">

                {Array.from({ length: review.rating }).map((_, idx) => (

                  <Star key={idx} size={16} fill="currentColor" />

                ))}

              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--muted)]">

                «{review.text}»

              </p>

              <div className="mt-5 border-t border-[var(--border)] pt-4">

                <div className="font-medium text-slate-900">{review.name}</div>

                <div className="text-xs text-[var(--muted-foreground)]">

                  {review.city} · {review.product}

                </div>

              </div>

            </motion.article>

          ))}

        </div>

      </Container>

    </section>

  );

}

