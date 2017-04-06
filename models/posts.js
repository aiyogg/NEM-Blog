var Post = require('../lib/mongo').Post
var marked = require('marked')

module.exports = {
  // 创建一篇文章
  create: function (post) {
    return Post.create(post).exec()
  },
  // 通过文章 id 获取一篇文章
  getPostById: function (postId) {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 按创建时间降序获取所有用户文章或某个特定用户的所有文章
  getPosts: function (author) {
    var query = {}
    if (author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  incPv: function (postId) {
    return Post
      .update({_id: postId}, {$inc: {pv: 1}})
      .exec()
  }
}

// 将 post.content 从 markdown 转换从 html
Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})