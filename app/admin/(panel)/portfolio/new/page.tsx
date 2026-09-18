import Link from "next/link";
import { DesignForm } from "@/components/admin/DesignForm";
import { getServices, getSubcategories } from "@/lib/content";

export default async function NewDesignPage() {
  const [services, subcategories] = await Promise.all([
    getServices(),
    getSubcategories(),
  ]);

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Portfolio</p>
          <h1>Add design</h1>
        </div>
        <Link href="/admin/portfolio" className="secondary-btn">
          Back
        </Link>
      </div>
      <DesignForm services={services} subcategories={subcategories} />
    </>
  );
}
