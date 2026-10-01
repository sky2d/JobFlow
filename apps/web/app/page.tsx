import styles from './page.module.css';

export default function Page() {
  return (
    <main className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Overview</h1>
        <p className={styles.subtitle}>Real-time monitoring and background job health</p>
      </header>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span className={`${styles.statusIndicator} ${styles.statusHealthy}`}></span>
            System Status
          </h2>
          <div className={styles.statValue}>Healthy</div>
          <div className={styles.statLabel}>All services operational</div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Jobs Processed (24h)</h2>
          <div className={styles.statValue}>14,209</div>
          <div className={styles.statLabel}>+12% from yesterday</div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>DLQ Size</h2>
          <div className={styles.statValue}>24</div>
          <div className={styles.statLabel}>Messages requiring attention</div>
        </div>
      </section>

      <section className={styles.recentJobs}>
        <h2 className={styles.cardTitle} style={{ paddingLeft: '1rem' }}>Recent Jobs</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Job ID</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tr}>
              <td className={styles.td}>job-9a8b-4c7d</td>
              <td className={styles.td}>SendEmail</td>
              <td className={styles.td}>
                <span className={`${styles.badge} ${styles.badgeSuccess}`}>Completed</span>
              </td>
              <td className={styles.td}>142ms</td>
            </tr>
            <tr className={styles.tr}>
              <td className={styles.td}>job-3f2e-1b9c</td>
              <td className={styles.td}>GenerateReport</td>
              <td className={styles.td}>
                <span className={`${styles.badge} ${styles.badgePending}`}>Processing</span>
              </td>
              <td className={styles.td}>--</td>
            </tr>
            <tr className={styles.tr}>
              <td className={styles.td}>job-7d6c-5b4a</td>
              <td className={styles.td}>ProcessPayment</td>
              <td className={styles.td}>
                <span className={`${styles.badge} ${styles.badgeFailed}`}>Failed</span>
              </td>
              <td className={styles.td}>850ms</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
