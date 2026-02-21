import { AppPage } from "@/components/app-page";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ROUTES } from "@/constants/routes";

const CleaningPage = () => {
  return (
    <AppPage
      title="Sprzątanie"
      breadcrumbs={[{ name: "Sprzątanie", path: ROUTES.cleaning.index }]}
    >
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>Strona w trakcie tworzenia</EmptyTitle>
          <EmptyDescription>
            Modul ten jest przygotowany jako rozszerzenie architektury i
            zostanie dodany w przyszłości
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </AppPage>
  );
};

export default CleaningPage;
