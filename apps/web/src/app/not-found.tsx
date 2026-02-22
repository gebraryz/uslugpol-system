const NotFoundPage = () => {
  return (
    <main className="flex min-h-[70dvh] items-center justify-center p-6 md:p-10">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-background p-8 shadow-sm md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.98_0_0),transparent_60%)]" />

        <div className="relative space-y-6">
          <p className="inline-flex w-fit items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Błąd 404
          </p>

          <div className="space-y-2">
            <p className="text-5xl font-semibold tracking-tight md:text-6xl">
              404
            </p>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Nie znaleziono strony
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Podany adres moze byc niepoprawny albo strona została
              przeniesiona.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
