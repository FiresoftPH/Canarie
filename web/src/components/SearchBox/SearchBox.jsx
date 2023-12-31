import styles from './SearchBox.module.css';

function SearchBox(props) {
  return (
    <div  className={styles.wrapper}>
      <input  className={styles.searchbox}
              type='text' 
              placeholder={'Search up the competency'}
              onChange={props.onInputChange}
              />
    </div>
  );
}

export default SearchBox