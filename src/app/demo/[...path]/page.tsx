import { notFound, redirect } from "next/navigation";

const demoPages = new Set(["menu", "gallery", "about", "contact"]);

export default async function DemoPageAlias({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;

  if (path.length !== 1 || !demoPages.has(path[0])) {
    notFound();
  }

  redirect(`/r/demo-restaurant/${path[0]}`);
}
