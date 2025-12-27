import prisma from '../../config/db.js';
import cloudinary from '../../config/cloudinary.js'; // ← Changed to default import

export const createPost = async (userId, content, file) => {
  let image = null;
  if (file) {
    const result = await cloudinary.uploader.upload(file.path); // ← Use cloudinary.uploader
    image = result.secure_url;
  }
  return prisma.post.create({
    data: { content, image, userId },
  });
};

export const getFeed = async (userId) => {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map(f => f.followingId);

  return prisma.post.findMany({
    where: { userId: { in: [...followingIds, userId] } },
    include: {
      user: { select: { username: true } },
      likes: true,
      comments: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPost = async (id) => {
  return prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      likes: true,
      comments: { include: { user: true } },
    },
  });
};

export const deletePost = async (id, userId) => {
  const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  if (!post || post.userId !== userId) {
    throw new Error('Unauthorized or post not found');
  }
  await prisma.post.delete({ where: { id: parseInt(id) } });
};