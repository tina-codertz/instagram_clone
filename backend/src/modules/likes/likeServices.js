import { query } from "../../config/db.js";

export const likePost = async (userId,postId) =>{
  try{
    await query(

      `INSERT INTO likes (post_id,user_id)
      VALUES ($1,$2)`,
      [parseInt(postId),userId]
    );
  } catch(err){
    if (err.code==="23505"){
      throw new Error("Already liked");
    }
    throw err;
  }
};

export const unlikePost = async (userId,postId) =>{
  await query(
    `DELETE FROM likes WHERE post_id=$1 AND user_id=$2`,
    [parseInt(postId), userId]
  );
};

