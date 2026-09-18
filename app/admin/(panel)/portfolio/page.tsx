import Link from "next/link";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteDesign } from "@/lib/admin-actions";
import { getDesigns } from "@/lib/content";

export default async function AdminPortfolioPage() {
  const designs = await getDesigns();

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="small-title">Mirrors Portfolio</p>
          <h1>Portfolio</h1>
        </div>
        <Link href="/admin/portfolio/new" className="primary-btn">
          Add design
        </Link>
      </div>
      <div className="admin-mini-grid">
        {designs.map((item) => (
          <article key={item.id} className="admin-item-card">
            <div
              className="admin-thumb"
              style={{ backgroundImage: `url('${item.image}')` }}
            />
            <h3>{item.title}</h3>
            <p>
              {item.category}
              {item.subcategoryName ? ` · ${item.subcategoryName}` : ""}
              {item.featured ? " · Featured" : ""}
            </p>
            <div className="admin-item-actions">
              <Link href={`/admin/portfolio/${item.id}`} className="secondary-btn">
                Edit
              </Link>
              <ConfirmDelete
                name={item.title}
                label="design"
                action={deleteDesign}
                hiddenFields={{ id: item.id }}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
