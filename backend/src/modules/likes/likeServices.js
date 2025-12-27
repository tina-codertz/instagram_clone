import prisma from '../../config/db.js';

export const likePost = async (userId, postId) => {
  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId: parseInt(postId), userId } },
  });
  if (existing) throw new Error('Already liked');

  await prisma.like.create({
    data: { postId: parseInt(postId), userId },
  });
};

export const unlikePost = async (userId, postId) => {
  await prisma.like.deleteMany({
    where: { postId: parseInt(postId), userId },
  });
};

