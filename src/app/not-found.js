import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <div className="py-24">
      <Container className="max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4b665d]">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#1d3128]">Page not found</h1>
        <p className="mt-4 text-lg leading-8 text-[#556a61]">
          The page may have moved or may not be published yet. Return to the homepage or browse the calculator library.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/" className="rounded-full bg-[#314841] px-6 py-3 text-sm font-semibold text-white">
            Go home
          </Link>
          <Link href="/calculators/" className="rounded-full border border-[#d0d9d8] bg-[#fcfcfb] px-6 py-3 text-sm font-semibold text-[#3f5950] transition hover:border-[#bec8ce] hover:text-[#556874]">
            Calculators
          </Link>
        </div>
      </Container>
    </div>
  );
}
