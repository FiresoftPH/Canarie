import styles from './SearchBox.module.css';

function SearchBox(props) {
  return (
    <div  className={styles.wrapper}>
      {/* <img className={styles.icon} src="src/assets/SearchIcon.svg" /> */}
      <input  className={`${props.dark ? styles.searchbox_dark : styles.searchbox}`}
              type='text' 
              placeholder={props.holder ? props.holder : 'Search up course'}
              onChange={props.onInputChange}
              />
    </div>
  );
}

export default SearchBox