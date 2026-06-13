interface ExperienceCardProps {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export default function ExperienceCard({ role, company, period, description, tags }: ExperienceCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
        <div>
          <h3 className="text-white text-base sm:text-lg font-bold leading-tight">{role}</h3>
          <p className="text-[#ffd86a]/70 text-sm font-medium mt-0.5">{company}</p>
        </div>
        <span className="text-white/25 text-[11px] tracking-wider sm:whitespace-nowrap mt-1">{period}</span>
      </div>

      <p className="text-[#e5d4a1]/80 leading-relaxed text-sm">{description}</p>

      <div className="flex flex-wrap gap-2 pt-1">
        {tags.map(t => (
          <span key={t} className="text-[10px] px-2.5 py-1 rounded-full border text-[#ffd86a]/60 border-[#ffd86a]/15 bg-[#ffd86a]/[0.04]">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
