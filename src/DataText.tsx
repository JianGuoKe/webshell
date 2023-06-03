import './DataText.less';
import stringify from 'safe-stable-stringify';
import _ from 'lodash';

export function DataText(props: { data: any }) {
  return (
    <p className="wsh-result-text">
      {stringify(
        props.data,
        (key, value) => {
          if (_.isDate(value)) {
            return value.toLocaleString();
          } else {
            return value;
          }
        },
        2
      )}
    </p>
  );
}
