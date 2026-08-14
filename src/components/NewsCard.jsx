import React from 'react';

export default function NewsCard({ article }) {
  const date = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="card" style={styles.card}>
      {article.imageUrl ? (
        <img src={article.imageUrl} alt={article.title} style={styles.image} />
      ) : (
        <div style={styles.imagePlaceholder} />
      )}
      <div style={styles.body}>
        <span style={styles.date}>{date}</span>
        <h3 style={styles.title}>{article.title}</h3>
        <p style={styles.summary}>{article.summary}</p>
        {article.tags?.length > 0 && (
          <div style={styles.tags}>
            {article.tags.map((t) => (
              <span key={t} style={styles.tag}>#{t}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

const styles = {
  card: { overflow: 'hidden' },
  image: { width: '100%', height: 180, objectFit: 'cover' },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    background: 'linear-gradient(135deg, var(--color-ink), var(--color-ink-deep))'
  },
  body: { padding: 20 },
  date: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.05em',
    color: 'var(--color-red)',
    textTransform: 'uppercase'
  },
  title: { fontSize: 19, margin: '8px 0 8px' },
  summary: { fontSize: 14, color: 'var(--color-text-muted)', margin: '0 0 10px' },
  tags: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  tag: {
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-ink)',
    background: 'var(--color-paper-alt)',
    padding: '3px 8px',
    borderRadius: 20
  }
};
