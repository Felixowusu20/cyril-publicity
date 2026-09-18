import Link from "next/link";
import { notFound } from "next/navigation";
import { ProcessForm } from "@/components/admin/ProcessForm";
import { getPrisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProcessPage({ params }: PageProps) {
  const { id } = await params;
  const prisma = getPrisma();
  const step = prisma
    ? await prisma.processStep.findUnique({ where: { id } })
    : null;
  if (!step) notFound();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Process</p>
          <h1>Edit {step.title}</h1>
        </div>
        <Link href="/admin/process" className="secondary-btn">
          Back
        </Link>
      </div>
      <ProcessForm step={step} />
    </>
  );
}
