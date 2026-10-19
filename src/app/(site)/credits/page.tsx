import credits from "@/lib/credits.json";

export const metadata = { title: "Photo credits" };

export default function Credits() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 pb-16 pt-28">
      <h1 className="text-3xl font-bold">Photo credits</h1>
      <p className="text-sm text-muted-foreground">Placeholder photos from Wikimedia Commons, used under the licences below.</p>
      <ul className="space-y-2 text-sm">
        {credits.map((c) => (
          <li key={c.file}><a href={c.source} className="underline">{c.title}</a> by {c.author} ({c.license})</li>
        ))}
      </ul>
    </div>
  );
}
