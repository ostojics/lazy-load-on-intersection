interface TimeDisplayProps {
  additionalText?: string;
}

const TimeDisplay = ({ additionalText }: TimeDisplayProps) => {
  return (
    <div>
      <p>Current time: {new Date().toISOString()}</p>
      {additionalText && <p>{additionalText}</p>}
    </div>
  );
};

export default TimeDisplay;
