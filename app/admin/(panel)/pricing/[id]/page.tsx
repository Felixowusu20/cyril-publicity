import Link from "next/link";
import { notFound } from "next/navigation";
import { PriceForm } from "@/components/admin/PriceForm";
import { getPrisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPricePage({ params }: PageProps) {
  const { id } = await params;
  const prisma = getPrisma();
  const plan = prisma ? await prisma.pricePlan.findUnique({ where: { id } }) : null;
  if (!plan) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Pricing</p>
          <h1>Edit {plan.title}</h1>
        </div>
        <Link href="/admin/pricing" className="secondary-btn">
          Back
        </Link>
      </div>
      <PriceForm plan={plan} />
    </>
  );
}
