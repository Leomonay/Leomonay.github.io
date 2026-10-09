// List of .tag chips (technologies, skills). `label` names the list for screen readers.
export default function TagList({ label, items }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="tag">
          {item}
        </li>
      ))}
    </ul>
  );
}
