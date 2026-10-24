export default function StepDone({ name, refId }) {
  return (
    <div className="rounded-xl border border-line px-6 py-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf text-2xl text-white">✓</div>
      <h2 className="mt-4 text-lg font-bold">Consent recorded</h2>
      <p className="mt-2 text-sm">Thank you, {name}. You can change or withdraw any choice at any time.</p>
      <p className="mt-1 text-xs text-ink/60">Reference: {refId}</p>
      {/* Replace href with your router link, e.g. <Link to="/dashboard"> */}
      <a href="#" className="mt-6 inline-block rounded-lg bg-leaf px-6 py-3 text-sm font-semibold text-white">Go to dashboard</a>
    </div>
  );
}
