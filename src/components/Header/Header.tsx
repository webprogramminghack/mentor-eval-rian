import styles from './Header.module.scss';

export const Header: React.FC = () => {
    return <div className={styles.header}>
        <h1>Let's Get Things Done!</h1>
        <p>One Step Closer to Your Goals</p>
    </div>
}