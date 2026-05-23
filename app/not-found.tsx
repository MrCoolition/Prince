import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="notFound">
      <section>
        <p className="eyebrow">Prince Academy</p>
        <h1>The gate is closed.</h1>
        <p>
          This path does not lead into the citadel. Return to the castle map and
          continue the prince's formation.
        </p>
        <Link href="/">Return to the citadel</Link>
      </section>
    </main>
  );
}
