"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { ChevronDown, Menu, MessageCircle, Search } from "lucide-react";
import { Container } from "./container";
import { useConsultation } from "@/components/storefront/consultation-context";

const PHONE = "+7 (963) 704-81-77";
const PHONE_HREF = "tel:+79637048177";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { openConsultation } = useConsultation();

  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = useMemo(() => {
    return pathname?.startsWith("/admin") || pathname === "/admin-login";
  }, [pathname]);

  if (isAdmin) return null;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();

    if (!q) {
      router.push("/products");
      return;
    }

    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="site-header relative z-40 mx-auto w-full bg-white">
      <Container>
        <div className="flex w-full flex-col justify-between">
          <div className="flex h-[40px] min-w-0 items-center gap-4">
            <Link href="/" className="flex h-[40px] shrink-0 items-center">
              <img
                src="/Logo_99.png"
                alt="RION"
                className="h-[84px] w-auto object-contain"
              />
            </Link>

            <button
              type="button"
              className="flex h-[40px] w-[136px] shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[#2563EB] px-3 text-[14px] font-semibold text-white hover:bg-[#1D4ED8]"
            >
              <Menu size={18} strokeWidth={2.2} />
              <span>Каталог</span>
              <ChevronDown size={16} strokeWidth={2.2} />
            </button>

            <form onSubmit={handleSearch} className="min-w-[220px] flex-1">
              <div className="flex h-[40px] w-full overflow-hidden rounded-[10px] border border-[#DDE3EC] bg-[#F7F9FC]">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Найти плитку, смеситель, люстру..."
                  className="h-full min-w-0 flex-1 bg-transparent px-4 text-[14px] text-[#111827] outline-none placeholder:text-[#98A2B3]"
                />
                <button
                  type="submit"
                  aria-label="Поиск"
                  className="flex h-[40px] w-[42px] shrink-0 items-center justify-center bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                >
                  <Search size={17} strokeWidth={2.2} />
                </button>
              </div>
            </form>

            <div className="ml-auto flex shrink-0 items-center gap-3">
              <div className="flex min-w-[188px] flex-col items-start justify-center leading-none">
                <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-[#667085]">
                  <span className="h-[8px] w-[8px] rounded-full bg-[#22C55E]" />
                  <span className="text-[16px]">Менеджер онлайн</span>
                </div>
                <a
                  href={PHONE_HREF}
                  className="text-[16px] font-semibold text-[#111827] hover:text-[#2563EB] pt-1"
                >
                  {PHONE}
                </a>
              </div>

              {/* <button
                type="button"
                aria-label="Чат"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#DDE3EC] bg-white text-[#111827] hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                <MessageCircle size={18} strokeWidth={2} />
              </button> */}

              {/* <button
                type="button"
                onClick={openConsultation}
                className="flex h-[40px] items-center justify-center rounded-[10px] bg-[#2563EB] px-5 text-[14px] font-semibold text-white hover:bg-[#1D4ED8]"
              >
                Консультация
              </button> */}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
