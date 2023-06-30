import styles from './SearchBox.module.css';

function SearchBox(props) {
  return (
    <div className={styles.wrapper}>
      {/* <img className={styles.icon} src="src/assets/SearchIcon.svg" /> */}
      <input  className={styles.searchbox}
              type='text' 
              placeholder='Search up course'
              onChange={props.onInputChange}
              />
    </div>
  );
}

export default SearchBox