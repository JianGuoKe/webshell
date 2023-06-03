import './DataText.less';

export function DataText(props: { data: any }) {
  return (
    <p className="wsh-result-text">{JSON.stringify(props.data, null, 2)}</p>
  );
}
