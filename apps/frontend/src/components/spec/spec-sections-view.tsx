import { SpecSectionIcon } from '@/components/spec/spec-section-icon';
import { GeneratedSpec, orderedSections, sectionLabels } from '@/types/spec';

type SpecSectionsViewProps = {
  spec: GeneratedSpec;
};

export function SpecSectionsView({ spec }: SpecSectionsViewProps) {
  return (
    <div className="results-stack">
      {orderedSections.map((sectionKey) => {
        const section = spec[sectionKey];

        return (
          <article className="result-card" key={sectionKey}>
            <div className="result-card-header">
              <div className="result-heading">
                <span className="result-icon-frame">
                  <SpecSectionIcon section={sectionKey} />
                </span>
                <div>
                  <span className="result-chip">{sectionLabels[sectionKey]}</span>
                  <h3 className="result-title">{section.title}</h3>
                </div>
              </div>
            </div>
            <ul className="result-list">
              {section.content.map((item, index) => (
                <li className="result-list-item" key={`${sectionKey}-${index}-${item}`}>
                  <span className="result-list-marker">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
