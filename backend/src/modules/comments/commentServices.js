import prisma from '../../config/db.js';

export const createComment = async (userId, postId, content) => {
  return prisma.comment.create({
    data: {
      content,
      postId: parseInt(postId),
      userId,
    },
  });
};

export const getComments = async (postId) => {
  return prisma.comment.findMany({
    where: { postId: parseInt(postId) },
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  });
};