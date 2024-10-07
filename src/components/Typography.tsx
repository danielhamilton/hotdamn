export default function Typography() {
  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Typography</h1>

      <h2 className="mb-4 font-mono text-xl">SupplyMono</h2>
      <div className="mb-8 font-mono">
        <p className="mb-2 text-xs font-extralight">
          Hello There! (Ultralight)
        </p>
        <p className="mb-2 text-xs font-normal">Hello There! (Regular)</p>
        <p className="mb-2 text-xs font-medium">Hello There! (Medium)</p>
        <p className="mb-2 text-xs font-bold">Hello There! (Bold)</p>
      </div>

      <h2 className="mb-4 font-sans text-xl">SupplySans</h2>
      <div className="font-sans">
        <p className="text-md mb-2 font-extralight">
          Hello There! (Ultralight)
        </p>
        <p className="text-md mb-2 font-normal">Hello There! (Regular)</p>
        <p className="text-md mb-2 font-medium">Hello There! (Medium)</p>
        <p className="text-md mb-2 font-bold">Hello There! (Bold)</p>
      </div>
    </div>
  );
}
