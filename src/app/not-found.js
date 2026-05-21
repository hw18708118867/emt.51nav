import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <div className="py-24">
      <Container className="max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">Page not found</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          The page may have moved or may not be published yet. Return to the homepage or browse the calculator library.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
            Go home
          </Link>
          <Link href="/calculators/" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800">
            Calculators
          </Link>
        </div>
      </Container>
    </div>
  );
}
