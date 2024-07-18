import styles from './App.module.scss';
import classNames from 'classnames/bind';
import { Workspace } from '~/components/specific';

const cx = classNames.bind(styles);

const App = () => {
  return (
    <div className={cx('App')}>
      <Workspace />
    </div>
  );
};

export default App;
