import Link from "next/link";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Services</p>
          <h1>Add service</h1>
        </div>
        <Link href="/admin/services" className="secondary-btn">
          Back
        </Link>
      </div>
      <ServiceForm />
    </>
  );
}
