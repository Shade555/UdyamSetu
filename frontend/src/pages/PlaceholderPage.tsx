export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <section>
      <h1 className="text-3xl font-bold text-neutral-900">
        This is the {title} page
      </h1>
    </section>
  );
}
