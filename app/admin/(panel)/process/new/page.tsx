import Link from "next/link";
import { ProcessForm } from "@/components/admin/ProcessForm";

export default function NewProcessPage() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Process</p>
          <h1>Add step</h1>
        </div>
        <Link href="/admin/process" className="secondary-btn">
          Back
        </Link>
      </div>
      <ProcessForm />
    </>
  );
}
