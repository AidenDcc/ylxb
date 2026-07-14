/** 病友圈子 */
export interface Circle {
  id: string
  name: string
  description: string
  coverImage: string
  memberCount: number
  postCount: number
  isOfficial: boolean
  category: string
  createdAt: string
}

/** 帖子 */
export interface Post {
  id: string
  circleId: string
  circleName: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorRole: 'patient' | 'doctor'
  authorTenants: string[]   // 展示作者所属租户
  content: string
  images: string[]
  likeCount: number
  commentCount: number
  collectCount: number
  isLiked: boolean
  isCollected: boolean
  isPinned: boolean
  isEssence: boolean        // 精华帖
  status: 'normal' | 'hidden' | 'pending'
  createdAt: string
}

/** 评论 */
export interface Comment {
  id: string
  postId: string
  parentId?: string    // 回复某条评论
  replyToId?: string   // 回复某人
  replyToName?: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorRole: 'patient' | 'doctor'
  content: string
  likeCount: number
  isLiked: boolean
  createdAt: string
}

/** 创建帖子 */
export interface CreatePostRequest {
  circleId: string
  content: string
  images: string[]
}

/** 创建评论 */
export interface CreateCommentRequest {
  postId: string
  parentId?: string
  replyToId?: string
  content: string
}
