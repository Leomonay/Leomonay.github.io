// List of .tag chips (technologies, skills). Name it for screen readers with `label`
// (aria-label) or, when there is a visible heading, with `labelId` (aria-labelledby)
// so the name isn't read twice. `subtle` renders the lighter variant for secondary lists.
export default function TagList({ label, labelId, items, subtle = false }) {
  return (
    <ul
      aria-label={labelId ? undefined : label}
      aria-labelledby={labelId}
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => (
        <li key={item} className={subtle ? 'tag tag-subtle' : 'tag'}>
          {item}
        </li>
      ))}
    </ul>
  );
}
