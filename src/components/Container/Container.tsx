import styles from './Container.module.scss';

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className={styles.container}>{children}</div>
}