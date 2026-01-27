import { query } from "../../config/db.js";


export const createComment = async(userId,postId,content)=>{
  const {rows} = await query(
    ` INSERT INTO comments(content, post_id,user_id)
    VALUES($1,$2,$3)
    RETURNING id, content,post_id,user_id,created_at`,
    [content, parseInt(postId),userId]
  );

  return rows[0];
};

export const getComments = async(postId)=>{
  const {rows} = await query(
    `SELECT c.id,c.content,c.created_at,u.username FROM comments c JOIN users u ON u.id = c.user_id WHERE c.post_id=$1 ORDER BY c.created_at DESC`,
    [parseInt(postId)]
  );

  return rows;
}