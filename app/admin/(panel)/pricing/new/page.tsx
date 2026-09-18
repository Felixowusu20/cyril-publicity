import Link from "next/link";
import { PriceForm } from "@/components/admin/PriceForm";

export default function NewPricePage() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Pricing</p>
          <h1>Add plan</h1>
        </div>
        <Link href="/admin/pricing" className="secondary-btn">
          Back
        </Link>
      </div>
      <PriceForm />
    </>
  );
}
