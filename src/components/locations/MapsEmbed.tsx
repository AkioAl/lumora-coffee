interface MapsEmbedProps {
  url: string
  name: string
}

export default function MapsEmbed({ name }: MapsEmbedProps) {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg overflow-hidden h-64 flex items-center justify-center">
      <p className="text-brand-muted font-mono text-sm">MapsEmbed ({name}) — Sprint 4</p>
    </div>
  )
}
