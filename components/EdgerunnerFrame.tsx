export default function EdgerunnerFrame({ color = "#d4ff00" }: { color?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <span className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: color }} />
      <span className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: color }} />
      <span className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: color }} />
      <span className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: color }} />
    </div>
  )
}