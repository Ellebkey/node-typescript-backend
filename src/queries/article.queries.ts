export const queryArticles = `
  SELECT
    a.concept "name",
    a.id
  FROM article a
  WHERE
    upper(a.concept) LIKE :searchText
  ORDER BY a.concept ASC
  LIMIT :limit
  OFFSET :offset
`;

export const queryCount = `
  SELECT
    COUNT(a.id)
  FROM article a
  WHERE
    upper(a.concept) LIKE :searchText
`;

export const queryHistory = `
  SELECT
    ar.day_seen as "daySeen", ar.price, r.name as "recipient", ar.discount
  FROM article_record as ar
    INNER JOIN recipient r on ar.recipient_id = r.id
  WHERE ar.article_id = :articleId
  ORDER BY ar.day_seen
`;

export const queryArticleRecords = `
  SELECT
    id
  FROM
    article_record ar
  WHERE
    ar.article_id = :articleId
    AND
      ar.day_seen <= :selectedDate
  ORDER BY ar.day_seen ASC
  LIMIT
  (
    CASE WHEN
      (SELECT COUNT(*) FROM article_record ar WHERE ar.article_id = :articleId AND ar.day_seen <= :selectedDate) > 0
    THEN
      (SELECT COUNT(*) FROM article_record ar WHERE ar.article_id = :articleId AND ar.day_seen <= :selectedDate) - 1
    ELSE
      1
    END
  );
`;
