import BeepView from './BeepView';

function BeepList({ beeps }) {
  return (
    <div>
      {beeps.map((beep) => (
        <BeepView key={beep.id} beep={beep} />
      ))}
    </div>
  );
}

export default BeepList;
