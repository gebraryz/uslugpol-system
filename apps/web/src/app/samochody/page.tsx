import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

const VehicleRentalRedirectPage = () => redirect(ROUTES.vehicles.leads);

export default VehicleRentalRedirectPage;
