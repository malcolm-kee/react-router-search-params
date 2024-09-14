import { useSearch } from '../hooks/use-search';
import { Input } from '../components/input';

export function BasicExample() {
  const [params, setParams] = useSearch({
    initial: {
      age: 4,
      isTesting: false,
      person: {
        fullName: 'Malcolm Kee',
      },
    },
  });

  return (
    <div>
      <div className="flex justify-center items-center gap-6 p-6">
        <Input
          type="text"
          value={params.person?.fullName || ''}
          onChange={(ev) => setParams({ person: { fullName: ev.target.value } })}
        />
        <Input
          type="number"
          value={params.age || ''}
          onChange={(ev) => {
            setParams({ age: ev.target.valueAsNumber });
          }}
        />
        <label>
          <input
            type="checkbox"
            checked={params.isTesting || false}
            onChange={(ev) => setParams({ isTesting: ev.target.checked })}
          />
          is Testing
        </label>
      </div>
      <div>Params</div>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}
